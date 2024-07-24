const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const { log } = require("console");
app.use(methodOverride("_method"));
const multer  = require('multer');
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, "./public/stuffs/uploadedfile");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
const upload = multer({ storage: storage });
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "faculty",
    password: "password",
    multipleStatements: true,
});
connection.connect();
global.db=connection;
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/stuffs")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
const d = new Date();
const day = d.getDate();
const month = d.toLocaleString('default', { month: 'numeric' });
const year = d.getFullYear();
let date = `${day}/${month}/${year}`

app.get("/login", (req, res) => {
    const message = req.query.message;
    res.render("login.ejs", { message });
});

app.post("/login", (req, res) => {
    const { email: formEmail, password: formPass } = req.body;
    const q = `SELECT *,count(*) from login where email='${formEmail}'`;
    try {
        connection.query(q, (err, user) => {
            if (err) {
                console.log(err);
                const errorMessage = "User don't exist or Wrong Password"; // Your error message
                // Redirect with the message as a query parameter
                res.redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
            } else {
                let count = user[0]["count(*)"];
                if (count == 0) {
                    const errorMessage = "User don't exist.";
                    // Redirect with the message as a query parameter
                    res.redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
                } else {
                    let password = user[0]["password"];
                    let applicationNo = user[0]["application_No"];
                    if (formPass == password) {
                        // Redirect with the username as a query parameter
                        res.redirect(`/page1?applicationNo=${encodeURIComponent(applicationNo)}`);
                    } else {
                        const errorMessage = "Wrong Password";
                        // Redirect with the message as a query parameter
                        res.redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
                    }
                }
            }
        });
    } catch {
        console.error(err);
        res.send("Some error occurred");
    }
})
app.get("/signUp", (req, res) => {
    const message = req.query.message;
    // console.log(message);
    res.render("signUp.ejs", { message });
});
app.post("/signUp", (req, res) => {
    const { email, username, password } = req.body;
    const q = "INSERT INTO login (email,username, password) VALUES (?, ?,?)";
    try {
        connection.query(q, [email, username, password], (err, result) => {
            if (err) {
                console.error(err);
                const errorMessage = "Email Already Exists"; // Your error message
                // Redirect with the message as a query parameter
                res.redirect(`/signUp?message=${encodeURIComponent(errorMessage)}`);

            } else {
                res.redirect("/login");
            }
        });
    } catch (err) {
        console.error(err);
        res.send("Some error occurred");
    }
});

app.get("/page1", (req, res) => {
    const applicationNo = req.query.applicationNo;
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page1.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page1",upload.fields([{ name: 'userfile2', maxCount: 1 },{ name: 'profile_img', maxCount: 1 }]), (req, res) => {
    const data = req.body;
    let { adv_num, doa, ref_num: app_num, post, dept, fname, mname, lname, nationality, dob, gender, mstatus, cast, id_proof, userfile2, father_name, profile_img, cadd, cadd1, cadd2, cadd3, cadd4, padd, padd1, padd2, padd3, padd4, mobile, email, mobile_2, email_2, landline,
    } = data;
    if(req.files.userfile2){
        userfile2=req.files.userfile2[0].filename;
        profile_img=req.files.profile_img[0].filename;
    }
    const deleteq = `DELETE FROM page1 WHERE app_num=?`;
    const query = `
        INSERT INTO page1 (
            adv_num, doa, app_num, post, dept, fname, mname, lname, nationality, dob,
            gender, mstatus, cast, id_proof, userfile2, father_name, profile_img,
            cadd, cadd1, cadd2, cadd3, cadd4, padd, padd1, padd2, padd3, padd4,
            mobile, email, mobile_2, email_2, landline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(deleteq, [app_num], (err) => {
        if (err) {
            res.send("Error in Updating!");
        } else {
            connection.query(query, [adv_num, doa, app_num, post, dept, fname, mname, lname, nationality, dob, gender, mstatus, cast, id_proof, userfile2, father_name, profile_img, cadd, cadd1, cadd2, cadd3, cadd4, padd, padd1, padd2, padd3, padd4, mobile, email, mobile_2, email_2, landline], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    res.redirect(`/page2?applicationNo=${encodeURIComponent(app_num)}`);
                }
            }
            );
        }
    })
});

app.get("/page2", (req, res) => {
    const applicationNo = req.query.applicationNo;
    console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page2.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page2",(req,res)=>{
    // console.log(req.body);
    // console.log(req.body['hsc_ssc[]'].length);
    const data = req.body;
    let {app_num,college_phd, stream, supervisor, yoj_phd, dod_phd, doa_phd, phd_title, pg_degree, pg_college, pg_subjects, pg_yoj, pg_yog, pg_duration, pg_perce, pg_rank, ug_degree, ug_college, ug_subjects, ug_yoj, ug_yog, ug_duration, ug_perce, ug_rank} = data;
    let dataD=[],dataE=[];
    for (let i = 0; i < data['hsc_ssc[]'].length; i++) {
        dataD.push([app_num,data['hsc_ssc[]'][i],data['school[]'][i],data['passing_year[]'][i],data['s_perce[]'][i],data['s_rank[]'][i]]);
    }
    for (let i = 0; i < data['add_degree[]'].length; i++) {
        dataE.push([app_num,data['add_degree[]'][i],data['add_college[]'][i],data['add_subjects[]'][i],data['add_yoj[]'][i],data['add_yog[]'][i],data['add_duration[]'][i],data['add_perce[]'][i],data['add_rank[]'][i]]);
    }
    const deleteq = `
    delete from page2abc where app_num=?;
    delete from page2d where app_num=?;
    delete from page2e where app_num=?;
    `;
    const query = `
        INSERT INTO page2abc (
            app_num,college_phd, stream, supervisor, yoj_phd, dod_phd, doa_phd, phd_title, pg_degree, pg_college, pg_subjects, pg_yoj, pg_yog, pg_duration, pg_perce, pg_rank, ug_degree, ug_college, ug_subjects, ug_yoj, ug_yog, ug_duration, ug_perce, ug_rank) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const insertD="insert into page2d(app_num,hsc_ssc,school,passing_year,s_perce,s_rank) values ?";
    const insertE="insert into page2e(app_num,add_degree,add_college,add_subjects,add_yoj,add_yog,add_duration,add_perce,add_rank) values ?";
    connection.query(deleteq, [app_num,app_num,app_num], (err) => {
        if (err) {
            console.log(err);
            res.send("Error in Updating!");
        } else {
            connection.query(query, [app_num,college_phd, stream, supervisor, yoj_phd, dod_phd, doa_phd, phd_title, pg_degree, pg_college, pg_subjects, pg_yoj, pg_yog, pg_duration, pg_perce, pg_rank, ug_degree, ug_college, ug_subjects, ug_yoj, ug_yog, ug_duration, ug_perce, ug_rank], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    connection.query(insertD,[dataD],(err,result)=>{
                        if(err){
                            res.send(err);
                        }else{
                            connection.query(insertE,[dataE],(err,result)=>{
                                if(err){
                                    res.send(err);
                                }else{
                                    res.redirect(`/page3?applicationNo=${encodeURIComponent(app_num)}`);
                                }
                            });
                        }
                    });
                }
            }
            );
        }
    })
});
app.get("/page3", (req, res) => {
    const applicationNo = req.query.applicationNo;
    console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page3.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page3",(req,res)=>{
    // console.log(req.body);
    // res.redirect("/page5");
    const data = req.body;
    let {app_num, pres_emp_position, pres_emp_employer, pres_status, pres_emp_doj, pres_emp_dol, pres_emp_duration,teach_exp_declaration,teach_exp,area_spl,area_rese} = data;
    // console.log(area_spl);
    let dataB=[],dataC=[],dataD=[],dataE=[];
    for (let i = 0; i < data['position[]'].length; i++) {
        dataB.push([app_num,data['position[]'][i],data['employer[]'][i],data['doj[]'][i],data['dol[]'][i],data['exp_duration[]'][i]]);
    }
    for (let i = 0; i < data['te_position[]'].length; i++) {
        dataC.push([app_num,data['te_position[]'][i],data['te_employer[]'][i],data['te_course[]'][i],data['te_ug_pg[]'][i],data['te_no_stu[]'][i],data['te_doj[]'][i],data['te_dol[]'][i],data['te_duration[]'][i]]);
    }
    for (let i = 0; i < data['r_exp_position[]'].length; i++) {
        dataD.push([app_num,data['r_exp_position[]'][i],data['r_exp_institute[]'][i],data['r_exp_supervisor[]'][i],data['r_exp_doj[]'][i],data['r_exp_dol[]'][i],data['r_exp_duration[]'][i]]);
    }
    for (let i = 0; i < data['org[]'].length; i++) {
        dataE.push([app_num,data['org[]'][i],data['work[]'][i],data['ind_doj[]'][i],data['ind_dol[]'][i],data['period[]'][i]]);
    }
    const deleteq = `
    delete from page3a where app_num=?;
    delete from page3b where app_num=?;
    delete from page3c where app_num=?;
    delete from page3d where app_num=?;
    delete from page3e where app_num=?;
    delete from page3f4 where app_num=?;
    `;
    const query = `
        INSERT INTO page3a (app_num, pres_emp_position, pres_emp_employer, pres_status, pres_emp_doj, pres_emp_dol, pres_emp_duration) VALUES (?,?,?,?,?,?,?);
        insert into page3f4(app_num,teach_exp_declaration,teach_exp,area_spl,area_rese) values (?,?,?,?,?);`;
    const insertB=`
    insert into page3b(app_num, position, employer, doj, dol, exp_duration) values ?;
    insert into page3c(app_num,te_position, te_employer, te_course, te_ug_pg, te_no_stu, te_doj, te_dol, te_duration) values ?;
    insert into page3d(app_num,r_exp_position, r_exp_institute, r_exp_supervisor, r_exp_doj, r_exp_dol, r_exp_duration) values ?;
    insert into page3e(app_num,org, work, ind_doj, ind_dol, period) values ?;
    `;
    connection.query(deleteq, [app_num,app_num,app_num,app_num,app_num,app_num], (err) => {
        if (err) {
            console.log(err);
            res.send("Error in Updating!");
        } else {
            connection.query(query, [app_num, pres_emp_position, pres_emp_employer, pres_status, pres_emp_doj, pres_emp_dol, pres_emp_duration,app_num,teach_exp_declaration,teach_exp,area_spl,area_rese], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    connection.query(insertB,[dataB,dataC,dataD,dataE],(err,result)=>{
                        if(err){
                            res.send(err);
                        }else{
                            res.redirect(`/page4?applicationNo=${encodeURIComponent(app_num)}`);
                        }
                    });
                }
            }
            );
        }
    })
});
app.get("/page4", (req, res) => {
    const applicationNo = req.query.applicationNo;
    console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page4.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page4",(req,res)=>{
    // app_num, summary_journal_inter, summary_journal, summary_conf_inter, summary_conf_national, patent_publish, summary_book, summary_book_chapter, author, title, journal, year, impact, doi, status, pauthor, ptitle, p_country, p_number, pyear_filed, pyear_published, pyear_issued, bauthor, btitle, byear, bisbn, bc_author, bc_title, bc_year, bc_isbn, google_link, submit
    // console.log(req.body);
    const data = req.body;
    let {app_num, summary_journal_inter, summary_journal, summary_conf_inter, summary_conf_national, patent_publish, summary_book, summary_book_chapter,google_link} = data;
    // console.log(area_spl);
    let dataB=[],dataC=[],dataD=[],dataE=[];
    for (let i = 0; i < data['author[]'].length; i++) {
        dataB.push([app_num,data['author[]'][i],data['title[]'][i],data['journal[]'][i],data['year[]'][i],data['impact[]'][i],data['doi[]'][i],data['status[]'][i]]);
    }
    for (let i = 0; i < data['pauthor[]'].length; i++) {
        dataC.push([app_num,data['pauthor[]'][i],data['ptitle[]'][i],data['p_country[]'][i],data['p_number[]'][i],data['pyear_filed[]'][i],data['pyear_published[]'][i],data['pyear_issued[]'][i]]);
    }
    for (let i = 0; i < data['bauthor[]'].length; i++) {
        dataD.push([app_num,data['bauthor[]'][i],data['btitle[]'][i],data['byear[]'][i],data['bisbn[]'][i]]);
    }
    for (let i = 0; i < data['bc_author[]'].length; i++) {
        dataE.push([app_num,data['bc_author[]'][i],data['bc_title[]'][i],data['bc_year[]'][i],data['bc_isbn[]'][i]]);
    }
    const deleteq = `
    delete from page4Summary where app_num=?;
    delete from page4Publication where app_num=?;
    delete from page4patents where app_num=?;
    delete from page4books where app_num=?;
    delete from page4bookchapters where app_num=?;
    delete from page4googlescholar where app_num=?;
    `;
    const query = `
        INSERT INTO page4Summary (app_num, summary_journal_inter, summary_journal, summary_conf_inter, summary_conf_national, patent_publish, summary_book, summary_book_chapter) VALUES (?,?,?,?,?,?,?,?);
        insert into page4googlescholar(app_num,google_scholar_link) values (?,?);`;
    const insertB=`
    insert into page4Publication(app_num, author, title, journal, year, impact, doi, status) values ?;
    insert into page4patents(app_num,pauthor, ptitle, p_country, p_number, pyear_filed, pyear_published, pyear_issued) values ?;
    insert into page4books(app_num,bauthor, btitle, byear, bisbn) values ?;
    insert into page4bookchapters(app_num,bc_author, bc_title, bc_year, bc_isbn) values ?;
    `;
    connection.query(deleteq, [app_num,app_num,app_num,app_num,app_num,app_num], (err) => {
        if (err) {
            console.log(err);
            res.send("Error in Updating!");
        } else {
            connection.query(query, [app_num, summary_journal_inter, summary_journal, summary_conf_inter, summary_conf_national, patent_publish, summary_book, summary_book_chapter,app_num,google_link], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    connection.query(insertB,[dataB,dataC,dataD,dataE],(err,result)=>{
                        if(err){
                            res.send(err);
                        }else{
                            res.redirect(`/page5?applicationNo=${encodeURIComponent(app_num)}`);
                        }
                    });
                }
            }
            );
        }
    })
});
app.get("/page5", (req, res) => {
    const applicationNo = req.query.applicationNo;
    console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page5.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page5",(req,res)=>{
    // app_num, mname, mstatus, trg, porg, pyear, pduration, agency, stitle, samount, speriod, s_role, s_status, c_org, ctitle, camount, cperiod, c_role, c_status
    // console.log(req.body);
    const data = req.body;
    let {app_num}=data;
    let dataA=[],dataB=[],dataC=[],dataD=[],dataE=[];
    for (let i = 0; i < data['mname[]'].length; i++) {
        dataA.push([app_num,data['mname[]'][i],data['mstatus[]'][i]]);
    }
    for (let i = 0; i < data['trg[]'].length; i++) {
        dataB.push([app_num,data['trg[]'][i],data['porg[]'][i],data['pyear[]'][i],data['pduration[]'][i]]);
    }
    for (let i = 0; i < data['award_nature[]'].length; i++) {
        dataC.push([app_num,data['award_nature[]'][i],data['award_org[]'][i],data['award_year[]'][i]]);
    }
    for (let i = 0; i < data['agency[]'].length; i++) {
        dataD.push([app_num,data['agency[]'][i],data['stitle[]'][i],data['samount[]'][i],data['speriod[]'][i],data['s_role[]'][i],data['s_status[]'][i]]);
    }
    for (let i = 0; i < data['c_org[]'].length; i++) {
        dataE.push([app_num,data['c_org[]'][i],data['ctitle[]'][i],data['camount[]'][i],data['cperiod[]'][i],data['c_role[]'][i],data['c_status[]'][i]]);
    }
    const deleteq = `
    delete from page5SocietyMem where app_num=?;
    delete from page5training where app_num=?;
    delete from page5awards where app_num=?;
    delete from page5spons_proj where app_num=?;
    delete from page5consult_proj where app_num=?;
    `;
    const insertB=`
    insert into page5SocietyMem(app_num, mname, mstatus) values ?;
    insert into page5training(app_num,trg, porg, pyear, pduration) values ?;
    insert into page5awards(app_num,award_nature,award_org,award_year) values ?;
    insert into page5spons_proj(app_num,agency, stitle, samount, speriod, s_role, s_status) values ?;
    insert into page5consult_proj(app_num,c_org, ctitle, camount, cperiod, c_role, c_status) values ?;
    `;
    connection.query(deleteq, [app_num,app_num,app_num,app_num,app_num], (err) => {
        if (err) {
            console.log(err);
            res.send("Error in Updating!");
        } else {
            connection.query(insertB,[dataA,dataB,dataC,dataD,dataE], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    res.redirect(`/page6?applicationNo=${encodeURIComponent(app_num)}`);
                }
            }
            );
        }
    })
});
app.get("/page6", (req, res) => {
    const applicationNo = req.query.applicationNo;
    console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page6.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page6",(req,res)=>{
// app_num, id, phd_scholar, phd_thesis, phd_role, phd_ths_status, phd_ths_year, pg_scholar, pg_thesis, pg_role, pg_status, pg_ths_year, ug_scholar, ug_thesis, ug_role, ug_status, ug_ths_year, submit
    // console.log(req.body);
    const data = req.body;
    let {app_num}=data;
    let dataA=[],dataB=[],dataC=[];
    for (let i = 0; i < data['phd_scholar[]'].length; i++) {
        dataA.push([app_num,data['phd_scholar[]'][i],data['phd_thesis[]'][i],data['phd_role[]'][i],data['phd_ths_status[]'][i],data['phd_ths_year[]'][i]]);
    }
    for (let i = 0; i < data['pg_scholar[]'].length; i++) {
        dataB.push([app_num,data['pg_scholar[]'][i],data['pg_thesis[]'][i],data['pg_role[]'][i],data['pg_status[]'][i],data['pg_ths_year[]'][i]]);
    }
    for (let i = 0; i < data['ug_scholar[]'].length; i++) {
        dataC.push([app_num,data['ug_scholar[]'][i],data['ug_thesis[]'][i],data['ug_role[]'][i],data['ug_status[]'][i],data['ug_ths_year[]'][i]]);
    }
    const deleteq = `
    delete from page6phdthesis where app_num=?;
    delete from page6masters where app_num=?;
    delete from page6bachelors where app_num=?;
    `;
    const insertB=`
    insert into page6phdthesis(app_num, phd_scholar, phd_thesis, phd_role, phd_ths_status, phd_ths_year) values ?;
    insert into page6masters(app_num, pg_scholar, pg_thesis, pg_role, pg_status, pg_ths_year) values ?;
    insert into page6bachelors(app_num,ug_scholar, ug_thesis, ug_role, ug_status, ug_ths_year) values ?;
    `;
    connection.query(deleteq, [app_num,app_num,app_num], (err) => {
        if (err) {
            console.log(err);
            res.send("Error in Updating!");
        } else {
            connection.query(insertB,[dataA,dataB,dataC], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    res.redirect(`/page7?applicationNo=${encodeURIComponent(app_num)}`);
                }
            }
            );
        }
    })
});
app.get("/page7", (req, res) => {
    const applicationNo = req.query.applicationNo;
    console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page7.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page7",(req,res)=>{
    // app_num, research_statement, teaching_statement, rel_in, prof_serv, jour_details, conf_details, submit
    // console.log(req.body);
    const data = req.body;
    let {app_num, research_statement, teaching_statement, rel_in, prof_serv, jour_details, conf_details}=data;
    const deleteq = `
    delete from page7 where app_num=?;
    `;
    const insertB=`
    insert into page7(app_num, research_statement, teaching_statement, rel_in, prof_serv, jour_details, conf_details) values (?,?,?,?,?,?,?);
    `;
    connection.query(deleteq, [app_num], (err) => {
        if (err) {
            console.log(err);
            res.send("Error in Updating!");
        } else {
            connection.query(insertB,[app_num, research_statement, teaching_statement, rel_in, prof_serv, jour_details, conf_details], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    res.redirect(`/page8?applicationNo=${encodeURIComponent(app_num)}`);
                }
            }
            );
        }
    })
});
app.get("/page8",(req,res)=>{
    const applicationNo = req.query.applicationNo;
    console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page8.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page8",upload.fields([{ name: 'userfile7', maxCount: 1 },{ name: 'userfile', maxCount: 1 },{ name: 'userfile1', maxCount: 1 },{ name: 'userfile2', maxCount: 1 },{ name: 'userfile3', maxCount: 1 },{ name: 'userfile4', maxCount: 1 },{ name: 'userfile9', maxCount: 1 },{ name: 'userfile10', maxCount: 1 },{ name: 'userfile8', maxCount: 1 },{ name: 'userfile6', maxCount: 1 },{ name: 'userfile5', maxCount: 1 }]),(req,res)=>{
    //app_num,ref_name, position, association_referee, org, email, phone
    // console.log(req.body);
    const data = req.body;
    const upl=req.files;
    let {app_num}=data;
    let dataA=[],dataB=[];
    for (let i = 0; i < data.ref_name.length; i++) {
        dataA.push([app_num,data.ref_name[i],data.position[i],data.association_referee[i],data.org[i],data.email[i],data.phone[i]]);
    }
    if(!upl.userfile7){
        let file=[{filename:""}];
        upl.userfile7=file;
    }
    if(!upl.userfile){
        let file=[{filename:""}];
        upl.userfile=file;
    }
    if(!upl.userfile1){
        let file=[{filename:""}];
        upl.userfile1=file;
    }
    if(!upl.userfile2){
        let file=[{filename:""}];
        upl.userfile2=file;
    }
    if(!upl.userfile3){
        let file=[{filename:""}];
        upl.userfile3=file;
    }
    if(!upl.userfile4){
        let file=[{filename:""}];
        upl.userfile4=file;
    }
    if(!upl.userfile9){
        let file=[{filename:""}];
        upl.userfile9=file;
    }
    if(!upl.userfile10){
        let file=[{filename:""}];
        upl.userfile10=file;
    }
    if(!upl.userfile8){
        let file=[{filename:""}];
        upl.userfile8=file;
    }
    if(!upl.userfile6){
        let file=[{filename:""}];
        upl.userfile6=file;
    }
    if(!upl.userfile5){
        let file=[{filename:""}];
        upl.userfile5=file;
    }
    // console.log(req.files);
    dataB.push([app_num,upl.userfile7[0].filename,upl.userfile[0].filename,upl.userfile1[0].filename,upl.userfile2[0].filename,upl.userfile3[0].filename,upl.userfile4[0].filename,upl.userfile9[0].filename,upl.userfile10[0].filename,upl.userfile8[0].filename,upl.userfile6[0].filename,upl.userfile5[0].filename]);
    const deleteq = `
    delete from page8referees where app_num=?;
    delete from page8uploads where app_num=?;
    `;
    const insertB=`
    insert into page8referees(app_num,ref_name, position, association_referee, org, email, phone) values ?;
    insert into page8uploads(app_num,userfile7, userfile, userfile1, userfile2, userfile3, userfile4, userfile9, userfile10, userfile8, userfile6, userfile5) values ?;
    `;
    connection.query(deleteq, [app_num,app_num], (err) => {
        if (err) {
            console.log(err);
            res.send("Error in Updating!");
        } else {
            connection.query(insertB,[dataA,dataB], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    res.redirect(`/page9?applicationNo=${encodeURIComponent(app_num)}`);
                    // res.send("Done!");
                }
            }
            );
        }
    })
});

app.get("/page9",(req,res)=>{
    const applicationNo = req.query.applicationNo;
    console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("page9.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/page9",(req,res)=>{
    let data=req.body;
    let {app_num,my_state,decl_status}=data;
    let deleteq=`delete from page9declaration where app_num=?`;
    const q=`insert into page9declaration(app_num,my_state,decl_status) values (?,?,?)`;
    connection.query(deleteq, [app_num], (err) => {
        if (err) {
            console.log(err);
            res.send("Error in Updating!");
        } else {
            connection.query(q,[app_num,my_state,decl_status], (err, result) => {
                if (err) {
                    console.error("Error inserting into page1:", err);
                    res.status(500).send("Error inserting into database.");
                } else {
                    res.redirect(`/print?applicationNo=${encodeURIComponent(app_num)}`);
                    // res.send("done");
                }
            }
            );
        }
    })
});
app.get("/print",(req,res)=>{
    // res.render("print.ejs");
    const app_num= req.query.applicationNo;
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${app_num}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                connection.query("select * from page1 where app_num=?",[app_num],(err,page1)=>{
                    if(err){
                        res.send("Error in page1");
                    }else{
                        connection.query("select * from page2abc where app_num=?",[app_num],(err,page2abc)=>{
                            if(err){
                                res.send("Error in page2abc");
                            }else{
                                connection.query("select * from page2d where app_num=?",[app_num],(err,page2d)=>{
                                    if(err){
                                        res.send("Error in page2d");
                                    }else{
                                        connection.query("select * from page2e where app_num=?",[app_num],(err,page2e)=>{
                                            if(err){
                                                res.send("Error in page2e");
                                            }else{
                                                connection.query("select * from page3a where app_num=?",[app_num],(err,page3a)=>{
                                                    if(err){
                                                        res.send("Error in page3a");
                                                    }else{
                                                        connection.query("select * from page3b where app_num=?",[app_num],(err,page3b)=>{
                                                            if(err){
                                                                res.send("Error in page3b");
                                                            }else{
                                                                connection.query("select * from page3c where app_num=?",[app_num],(err,page3c)=>{
                                                                    if(err){
                                                                        res.send("Error in page3c");
                                                                    }else{
                                                                        connection.query("select * from page3d where app_num=?",[app_num],(err,page3d)=>{
                                                                            if(err){
                                                                                res.send("Error in page3d");
                                                                            }else{
                                                                                connection.query("select * from page3e where app_num=?",[app_num],(err,page3e)=>{
                                                                                    if(err){
                                                                                        res.send("Error in page3e");
                                                                                    }else{
                                                                                        connection.query("select * from page3f4 where app_num=?",[app_num],(err,page3f4)=>{
                                                                                            if(err){
                                                                                                res.send("Error in page3f4");
                                                                                            }else{
                                                                                                connection.query("select * from page4bookchapters where app_num=?",[app_num],(err,page4bookchapters)=>{
                                                                                                    if(err){
                                                                                                        res.send("Error in page4bookchapters");
                                                                                                    }else{
                                                                                                        connection.query("select * from page4books where app_num=?",[app_num],(err,page4books)=>{
                                                                                                            if(err){
                                                                                                                res.send("Error in page4books");
                                                                                                            }else{
                                                                                                                connection.query("select * from page4googlescholar where app_num=?",[app_num],(err,page4googlescholar)=>{
                                                                                                                    if(err){
                                                                                                                        res.send("Error in page4googlescholar");
                                                                                                                    }else{
                                                                                                                        connection.query("select * from page4patents where app_num=?",[app_num],(err,page4patents)=>{
                                                                                                                            if(err){
                                                                                                                                res.send("Error in page4patents");
                                                                                                                            }else{
                                                                                                                                connection.query("select * from page4publication where app_num=?",[app_num],(err,page4publication)=>{
                                                                                                                                    if(err){
                                                                                                                                        res.send("Error in page4publication");
                                                                                                                                    }else{
                                                                                                                                        connection.query("select * from page4summary where app_num=?",[app_num],(err,page4summary)=>{
                                                                                                                                            if(err){
                                                                                                                                                res.send("Error in page4summary");
                                                                                                                                            }else{
                                                                                                                                                connection.query("select * from page5awards where app_num=?",[app_num],(err,page5awards)=>{
                                                                                                                                                    if(err){
                                                                                                                                                        res.send("Error in page5awards");
                                                                                                                                                    }else{
                                                                                                                                                        connection.query("select * from page5consult_proj where app_num=?",[app_num],(err,page5consult_proj)=>{
                                                                                                                                                            if(err){
                                                                                                                                                                res.send("Error in page5consult_proj");
                                                                                                                                                            }else{
                                                                                                                                                                connection.query("select * from page5societymem where app_num=?",[app_num],(err,page5societymem)=>{
                                                                                                                                                                    if(err){
                                                                                                                                                                        res.send("Error in page5societymem");
                                                                                                                                                                    }else{
                                                                                                                                                                        connection.query("select * from page5spons_proj where app_num=?",[app_num],(err,page5spons_proj)=>{
                                                                                                                                                                            if(err){
                                                                                                                                                                                res.send("Error in page5spons_proj");
                                                                                                                                                                            }else{
                                                                                                                                                                                connection.query("select * from page5training where app_num=?",[app_num],(err,page5training)=>{
                                                                                                                                                                                    if(err){
                                                                                                                                                                                        res.send("Error in page5training");
                                                                                                                                                                                    }else{
                                                                                                                                                                                        connection.query("select * from page6bachelors where app_num=?",[app_num],(err,page6bachelors)=>{
                                                                                                                                                                                            if(err){
                                                                                                                                                                                                res.send("Error in page6bachelors");
                                                                                                                                                                                            }else{
                                                                                                                                                                                                connection.query("select * from page6masters where app_num=?",[app_num],(err,page6masters)=>{
                                                                                                                                                                                                    if(err){
                                                                                                                                                                                                        res.send("Error in page6masters");
                                                                                                                                                                                                    }else{
                                                                                                                                                                                                        connection.query("select * from page6phdthesis where app_num=?",[app_num],(err,page6phdthesis)=>{
                                                                                                                                                                                                            if(err){
                                                                                                                                                                                                                res.send("Error in page6phdthesis");
                                                                                                                                                                                                            }else{
                                                                                                                                                                                                                connection.query("select * from page7 where app_num=?",[app_num],(err,page7)=>{
                                                                                                                                                                                                                    if(err){
                                                                                                                                                                                                                        res.send("Error in page7");
                                                                                                                                                                                                                    }else{
                                                                                                                                                                                                                        connection.query("select * from page8referees where app_num=?",[app_num],(err,page8referees)=>{
                                                                                                                                                                                                                            if(err){
                                                                                                                                                                                                                                res.send("Error in page8referees");
                                                                                                                                                                                                                            }else{
                                                                                                                                                                                                                                connection.query("select * from page8uploads where app_num=?",[app_num],(err,page8uploads)=>{
                                                                                                                                                                                                                                    if(err){
                                                                                                                                                                                                                                        res.send("Error in page8uploads");
                                                                                                                                                                                                                                    }else{
                                                                                                                                                                                                                                        connection.query("select * from page9declaration where app_num=?",[app_num],(err,page9declaration)=>{
                                                                                                                                                                                                                                            if(err){
                                                                                                                                                                                                                                                res.send("Error in page9declaration");
                                                                                                                                                                                                                                            }else{
                                                                                                                                                                                                                                                res.render("print.ejs", { date, app_num,data, page1, page2abc, page2d, page2e, page3a, page3b, page3c, page3d, page3e, page3f4, page4summary, page4publication, page4patents, page4books, page4bookchapters, page4googlescholar, page5societymem, page5training, page5awards, page5spons_proj, page5consult_proj, page6phdthesis, page6masters, page6bachelors, page7, page8referees, page8uploads, page9declaration });
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                });
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        });
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                });
                                                                                                                                                                                                            }
                                                                                                                                                                                                        });
                                                                                                                                                                                                    }
                                                                                                                                                                                                });
                                                                                                                                                                                            }
                                                                                                                                                                                        });
                                                                                                                                                                                    }
                                                                                                                                                                                });
                                                                                                                                                                            }
                                                                                                                                                                        });
                                                                                                                                                                    }
                                                                                                                                                                });
                                                                                                                                                            }
                                                                                                                                                        });
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.get("/changePass",(req,res)=>{
    const applicationNo = req.query.applicationNo;
    // const message=req.query.message;
    // console.log(applicationNo);
    let q = `SELECT l.email as loginEmail,l.username as username FROM login l WHERE l.application_No='${applicationNo}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) {
                res.send("Error in quering.");
            } else {
                console.log(result);
                let data=result[0];
                res.render("changePassword.ejs", { date, applicationNo,data });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});
app.post("/changePass",(req,res)=>{
    // console.log(req.body);
    // res.send("Done!");
    let {app_num,old_password,new_password}=req.body;
    let q=`select * from login where application_No=${app_num}`;
    connection.query(q,(err,result)=>{
        if(err){
            res.send(err);
        }else{
            let password=result[0].password;
            if(old_password==password){
                connection.query("update login set password=? where application_No=?",[new_password,app_num],(err,result)=>{
                    if(err){
                        res.send(err);
                    }else{
                        const errorMessage = "Password Changed";
                        res.redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
                    }
                })
            }else{
                res.send("Wrong Old Password");
            }
        }
    });
});
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
}); 