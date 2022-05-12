let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let users = new Array();
users[0] = {
	"userId" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}

app.put('/login', (req, res) => {
	// users 배열에서 찾도록 처리 해야 함
	// admin 여부를 확인하여 체크
	// req.body.id : ID
	// req.body.name : 패스워드
	if ("userId" in req.session){
		res.send("이미 로그인중입니다.");
		return true;
	}

	if(!(users.some(u => u.userId === req.body.id && u.password === req.body.password))){
		res.send("잘못된 로그인 정보를 입력하셨습니다.");
		return false;
	}
	req.session.userId = req.body.id;
	req.session.isAdmin = users.some(u => u.userId === req.body.id && u.isAdmin);
	req.session.save(function(){
		res.send("LogIn");
	});
	return true;
});

app.put('/logout', (req, res) => {
	// Logout
	// 세션 유효 여부를 체크하고 세션 Delete
	if ("userId" in req.session){
		req.session.destroy(function(err){});
		res.send("LogOut");
		return true;
	}
	res.send('로그아웃 상태입니다.');
	return true;
});

let auth = (req, res, next) => {
	// Session Check
	// 어드민 여부 체크 필요
	if (req.session.userId != null && req.session.isAdmin)
		next();
	else
		res.send("Error");

};
app.get('/user/:userId', auth, (req, res) => {
	// get User Information
	if (!(users.some(u => u.userId == req.params.userId))){
		res.send('사용자 정보가 없습니다.');
		return false;
	}
	let userIndex = users.findIndex((item, idx) => {
		return item.userId == req.params.userId;
	})
	res.send(users[userIndex]);
	return true;
});

// 사용자 추가 시에 admin 여부도 추가해야 함
app.put('/users', auth, (req, res) => {
	if (!(users.some(u => u.userId == req.body.id))){
		res.send('사용자 정보가 없습니다.');
		return false;
	}
	if (req.session.userId == req.body.id && !req.body.isAdmin){
		res.send("잘못된 접근입니다.");
		return false;
	}

	let userIndex = users.findIndex((item, idx) => {
		return item.userId == req.body.id;
	})
	users[userIndex] = {	
		"userId" : req.body.id,
		"name" : req.body.name,
		"password" : req.body.password,
		"isAdmin" : req.body.isAdmin
	}
	res.send("사용자 정보 업데이트를 성공했습니다.");
	return true;
});

app.post('/users', auth, (req, res) => {
	if (users.some(u => u.userId == req.body.id)){
		res.send('이미 존재하는 사용자 정보입니다.');
		return false;
	}
	users[users.length] = {	
		"userId" : req.body.id,
		"name" : req.body.name,
		"password" : req.body.password,
		"isAdmin" : req.body.isAdmin
	}
	res.send("사용자 정보를 추가했습니다.");
	return true;
});

app.delete('/users/:userId', auth, (req, res) => {
	if (!(users.some(u => u.userId == req.params.userId))){
		res.send('사용자 정보가 없습니다.');
		return false;
	}
	if (req.session.userId == req.params.userId){
		res.send("잘못된 접근입니다.");
		return false;
	}
	let userIndex = users.findIndex((item, idx) => {
		return item.userId == req.params.userId;
	})
	let spliceResult = users.splice(userIndex, 1);
	res.send("사용자 정보를 삭제했습니다.");
	return true;
});


let server = app.listen(80);
