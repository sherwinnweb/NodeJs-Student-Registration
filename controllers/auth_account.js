const mysql = require('mysql2');
const encryption = require('bcrypt')
const jwt = require('jsonwebtoken');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});

// exports.addAccount = (req,res)=>{
    
//     const {firstName, lastName,email,password,confirmpassword}=req.body;
    
//     db.query('SELECT email FROM user WHERE email = ?',email,async function(err, row){
//         if(err){
//             console.log('error message' + err);
//         }else if(confirmpassword !== password){
//             return res.render("registration", {message: "password don't match"})}
//         else {
//             if(row.length){
//             console.log('email already existed');
//             return res.render("registration",{message: "Email is already existing"});
            
//             }else{
//                 let hashPassword = await encryption.hash(password,8);
//                 console.log(hashPassword);
//                 db.query('INSERT INTO user set ?',{first_name:firstName, last_name:lastName, email: email, password:hashPassword},
        
//                 // db.query('INSERT INTO user (first_name, last_name, email, password) VALUES(?,?,?,?)',
//                 // [firstName, lastName, email,password],
//                 (err,result)=>{
//                     if(err){
//                         return console.log('error message' + err);
//                     }else{
//                         console.log(result);
//                         return res.render("registration", {message: "User have been registered successfully"});
//                     }
//                 }); 
//         }}
//     })
// };

exports.loginAccount = async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.render("index", {message: "email or password cannot be empty"})
        }else{
            
            db.query('SELECT * FROM user WHERE email = ?',email,async function(err, row){
                if(!row ){
                    return res.render("index", {message: "email is incorrect"});
                    //first parameter: from form, seond parameter: from database
                }else if(!(await encryption.compare(password, row[0].password))){
                    return res.render("index",{message: "password is incorrect"})
                }else{
                    const id = row[0].user_id;
                    const token = jwt.sign(id, process.env.JWT_SECRET);
                    const cookieOption = {epires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRES)*1000*24*60,httpOnly:true,};
                    res.cookie("cookie_access_token", token, cookieOption)
                    console.log(token);
                    db.query('SELECT * FROM students s INNER JOIN course c ON s.course_id = c.course_id', (err, result)=>{
                        if(!result){
                            return res.render("accounts"),{message: "No records found"};
                        } else{
                            console.log(result)
                            return res.render("accounts",{title: "List of students", data: result})
                            
                        }
                    })
                    // return res.render("index",{message:"Logged in successfully"})
                }
            })
        }
    }
    catch(err){console.log(err)}
};

exports.updateform = (req, res)=>{
    const email = req.params.email;
    console.log('hi')
    db.query('SELECT s.student_id, s.first_name, s.last_name, s.email, s.course_id, c.course_name FROM students s INNER JOIN course c ON s.course_id = c.course_id WHERE s.email = ? ORDER BY s.student_id ASC',email, (err, result)=>{
        let courseId = result[0].course_id;
        
        if(courseId==1){
            res.render('updateform',{title: "Update student account", data: result[0], courseId1: "selected"})
        console.log(result[0].course_id)
        }else if(courseId == 2){
            res.render('updateform',{title: "Update student account", data: result[0], courseId2: "selected"})
        }else {
            res.render('updateform',{title: "Update student account", data: result[0], courseId3: "selected"})
        }
        
        // res.render('updateform',{title: "Update student account", data: result[0]})
        // console.log(result[0].course_id)
    })
    
}

exports.updateStudent = (req, res) => {
    const{firstName, lastName, email, courseName} = req.body;
    db.query('UPDATE students SET first_name = ?, last_name = ? WHERE email = ?', [firstName, lastName, email,courseName],(err,)=>{
        db.query('SELECT * FROM students s INNER JOIN course c ON s.course_id = c.course_id',(err,result)=>{
            res.render('accounts',{title:'List of user', data:result})
            
        })
    }
    )
};

exports.deleteStudent = (req,res) => {
    const email = req.params.email;
    console.log(email)
    db.query('DELETE FROM students WHERE email = ?', email,(err)=>{
        db.query('SELECT * FROM students s INNER JOIN course c ON s.course_id = c.course_id',(err,result)=>{
            res.render('accounts', {title:'List of user', data:result})
        })
    })
};

exports.logout = (req, res)=>{
    // if(req.session){
    //     req.session.destroy((err)=>{
    //         if(err){res.status(400).send("unable to logout");
    //         }else{
                res.clearCookie("cookie_access_token");
                res.render('index',{message:"Logged out"});
    //         }
    //     })
    // }else{
    //     console.log("no session");
    //     res.end();
    // }
};
exports.addStudent = (req,res)=>{
    
    const {firstName, lastName,email,courseName}=req.body;
    
    db.query('SELECT email FROM students WHERE email = ?',email,async function(err, row){
        if(err){
            console.log('error message' + err);
        }else {
            if(row.length){
            console.log('email already existed');
            return res.render("registration",{message: "Email is already existing"});
            
            }else{
                db.query('INSERT INTO students set ?',{first_name:firstName, last_name:lastName, email: email,course_id:courseName},
        
                // db.query('INSERT INTO user (first_name, last_name, email, password) VALUES(?,?,?,?)',
                // [firstName, lastName, email,password],
                (err,result)=>{
                    if(err){
                        return console.log('error message' + err);
                    }else{
                        console.log(result);
                        return res.render("registration", {message: "Student have been registered successfully"});
                    }
                }); 
        }}
    })
};
