create database faculty;
use faculty;

CREATE TABLE login (
    application_No INT primary key auto_increment,
    email VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);
alter table login auto_increment=1698348185;

insert into login(email,username,password) values
("aditya1a2yadav@gmail.com","AdityaChauhan","Aditya1@2");

select * from login;
update login set username="aditya2" where application_No=1698348189;

Create table if not exists page1(
	adv_num varchar(255),
    doa varchar(255),
	app_num int not null primary key,
    post char(225),
    dept varchar(255),
    fname varchar(255),
    mname varchar(255),
    lname varchar(255),
    nationality varchar(255),
    dob varchar(255),
    gender varchar(255),
    mstatus varchar(255),
    cast varchar(255),
    id_proof varchar(255),
    userfile2 char(225),
    father_name varchar(255),
    profile_img char(225),
    cadd varchar(255),
    cadd1 varchar(255),
    cadd2 varchar(255),
    cadd3 varchar(255),
    cadd4 varchar(255),
    padd varchar(255),
    padd1 varchar(255),
    padd2 varchar(255),
    padd3 varchar(255),
    padd4 varchar(255),
    mobile varchar(255),
    email varchar(255),
    mobile_2 varchar(255),
    email_2 varchar(255),
    landline int,
    foreign key(app_num) references login(application_no)
); 
select* from page1;

CREATE TABLE if not exists page2ABC (
	app_num int not null primary key,
    college_phd VARCHAR(255),
    stream VARCHAR(255),
    supervisor VARCHAR(255),
    yoj_phd VARCHAR(255),
    dod_phd VARCHAR(255),
    doa_phd VARCHAR(255),
    phd_title VARCHAR(255),
    pg_degree VARCHAR(255),
    pg_college VARCHAR(255),
    pg_subjects VARCHAR(255),
    pg_yoj VARCHAR(255),
    pg_yog VARCHAR(255),
    pg_duration VARCHAR(255),
    pg_perce VARCHAR(255),
    pg_rank VARCHAR(255),
    ug_degree VARCHAR(255),
    ug_college VARCHAR(255),
    ug_subjects VARCHAR(255),
    ug_yoj VARCHAR(255),
    ug_yog VARCHAR(255),
    ug_duration VARCHAR(255),
    ug_perce VARCHAR(255),
    ug_rank VARCHAR(255),
    foreign key(app_num) references login(application_No)
);

select * from page2abc;

CREATE TABLE if not exists page2d(
	app_num int not null,
	hsc_ssc varchar(255),
    school varchar(255),
    passing_year varchar(255),
    s_perce varchar(255),
    s_rank varchar(255)
);

select * from page2d;

CREATE TABLE IF NOT EXISTS page2e (
	app_num int not null,
    add_degree VARCHAR(255),
    add_college VARCHAR(255),
    add_subjects VARCHAR(255),
    add_yoj VARCHAR(255),  
    add_yog VARCHAR(255),  
    add_duration VARCHAR(255),
    add_perce VARCHAR(255), 
    add_rank VARCHAR(255)
);

select * from page2e;

CREATE TABLE IF NOT EXISTS page3A (
    app_num int not null,          
    pres_emp_position VARCHAR(255),
    pres_emp_employer VARCHAR(255),
    pres_status VARCHAR(255),      
    pres_emp_doj VARCHAR(255),     
    pres_emp_dol VARCHAR(255),     
    pres_emp_duration VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS page3B (
	app_num int not null,
    position VARCHAR(255),
    employer VARCHAR(255),
    doj VARCHAR(255),   
    dol VARCHAR(255),   
    exp_duration VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS page3C (
	app_num int not null,
    te_position VARCHAR(255),  
    te_employer VARCHAR(255),  
    te_course VARCHAR(255),    
    te_ug_pg VARCHAR(255),    
    te_no_stu INT,            
    te_doj VARCHAR(255),     
    te_dol VARCHAR(255),     
    te_duration VARCHAR(255)   
);

CREATE TABLE IF NOT EXISTS page3D (
	app_num int not null,
    r_exp_position VARCHAR(255),  
    r_exp_institute VARCHAR(255),  
    r_exp_supervisor VARCHAR(255), 
    r_exp_doj VARCHAR(255),      
    r_exp_dol VARCHAR(255),       
    r_exp_duration VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS page3E (
	app_num int not null,
    org VARCHAR(255),      
    work VARCHAR(255),  
    ind_doj VARCHAR(255), 
    ind_dol VARCHAR(255),
    period VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS page3F4 (
	app_num int not null,
    teach_exp_declaration TEXT, 
    teach_exp VARCHAR(10),   
    area_spl TEXT,   
    area_rese TEXT 
);
select * from page3a;
select * from page3b;
select * from page3c;
select * from page3e;
select * from page3f4;

CREATE TABLE IF NOT EXISTS page4Summary (
    app_num int not null,   
    summary_journal_inter VARCHAR(255), 
    summary_journal VARCHAR(255),    
    summary_conf_inter VARCHAR(255),  
    summary_conf_national VARCHAR(255),
    patent_publish VARCHAR(255),   
    summary_book VARCHAR(255),     
    summary_book_chapter VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS page4Publication (
    app_num int not null, 
    author VARCHAR(255),
    title VARCHAR(255), 
    journal VARCHAR(255),
    year VARCHAR(255),   
    impact VARCHAR(255), 
    doi VARCHAR(255),   
    status VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS page4patents (
    app_num int not null, 
    pauthor VARCHAR(255),
    ptitle VARCHAR(255),  
    p_country VARCHAR(255), 
    p_number VARCHAR(255),   
    pyear_filed VARCHAR(255), 
    pyear_published VARCHAR(255),
    pyear_issued VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS page4books (
    app_num int not null,
    bauthor VARCHAR(255), 
    btitle VARCHAR(255), 
    byear VARCHAR(255), 
    bisbn VARCHAR(255)  
);

CREATE TABLE IF NOT EXISTS page4bookchapters (
    app_num int not null, 
    bc_author VARCHAR(255),
    bc_title VARCHAR(255),  
    bc_year VARCHAR(255),  
    bc_isbn VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS page4googlescholar (
    app_num int not null, 
    google_scholar_link varchar(255)
);

select *from page4bookchapters;

CREATE TABLE IF NOT EXISTS page5SocietyMem (
    app_num int not null, 
    mname VARCHAR(255),
    mstatus VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS page5training (
    app_num int not null, 
    trg VARCHAR(255),   
    porg VARCHAR(255), 
    pyear VARCHAR(255),  
    pduration VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS page5awards (
	app_num int not null,
    award_nature VARCHAR(255),
    award_org VARCHAR(255),    
    award_year VARCHAR(255)   
);

CREATE TABLE IF NOT EXISTS page5spons_proj (
    app_num int not null,
    agency VARCHAR(255),
    stitle VARCHAR(255), 
    samount VARCHAR(255), 
    speriod VARCHAR(255),
    s_role VARCHAR(255),  
    s_status VARCHAR(255)  
);

CREATE TABLE IF NOT EXISTS page5consult_proj (
    app_num int not null,  
    c_org VARCHAR(255),  
    ctitle VARCHAR(255),  
    camount VARCHAR(255),  
    cperiod VARCHAR(255),  
    c_role VARCHAR(255), 
    c_status VARCHAR(255)  
);

CREATE TABLE page6phdthesis (
  app_num INT NOT NULL,
  phd_scholar VARCHAR(100),
  phd_thesis VARCHAR(255),
  phd_role VARCHAR(100),
  phd_ths_status VARCHAR(100),
  phd_ths_year VARCHAR(10)
);

CREATE TABLE page6masters (
  app_num INT NOT NULL,
  pg_scholar VARCHAR(255),
  pg_thesis VARCHAR(255),
  pg_role VARCHAR(255),
  pg_status VARCHAR(255),
  pg_ths_year VARCHAR(255)
);

CREATE TABLE page6bachelors (
  app_num INT NOT NULL,
  ug_scholar VARCHAR(255),
  ug_thesis VARCHAR(255),
  ug_role VARCHAR(255),
  ug_status VARCHAR(255),
  ug_ths_year VARCHAR(255)
);

select * from page6bachelors;

CREATE TABLE page7 (
  app_num INT NOT NULL,
  research_statement TEXT,
  teaching_statement TEXT,
  rel_in TEXT,
  prof_serv TEXT,
  jour_details TEXT,
  conf_details TEXT
);

select *from page7;

CREATE TABLE page8referees (
  app_num INT NOT NULL,
  ref_name VARCHAR(255),
  position VARCHAR(255),
  association_referee VARCHAR(255),
  org VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20)
);

CREATE TABLE page8uploads (
  app_num INT NOT NULL,
  userfile7 VARCHAR(255),
  userfile VARCHAR(255),
  userfile1 VARCHAR(255),
  userfile2 VARCHAR(255),
  userfile3 VARCHAR(255),
  userfile4 VARCHAR(255),
  userfile9 VARCHAR(255),
  userfile10 VARCHAR(255),
  userfile8 VARCHAR(255),
  userfile6 VARCHAR(255),
  userfile5 VARCHAR(255)
);

select * from page8uploads;

CREATE TABLE page9declaration (
  app_num INT NOT NULL,
  my_state text,
  decl_status varchar(255)
);
select * from page9declaration;

