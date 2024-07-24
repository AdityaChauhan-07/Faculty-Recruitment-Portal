let table = document.querySelector("#table_E");
let addmore = document.querySelector("#addmore");
//let deletebtn = document.querySelectorAll(".deletebtn");
let rowIndex=0;


addmore.addEventListener('click', function(){
    rowIndex++;
    let x1 = document.createElement("TR");
  x1.setAttribute("id", "myTr"+rowIndex);
  document.getElementById("table_E").appendChild(x1);


  let y1 = document.createElement("TD");
  let t1 = document.createElement("INPUT");
  t1.setAttribute("type", "text");
  t1.setAttribute("placeholder", "Degree");
  y1.appendChild(t1);

  let y2 = document.createElement("TD");
  let t2 = document.createElement("INPUT");
  t2.setAttribute("type", "text");
  t2.setAttribute("placeholder", "College");
  y2.appendChild(t2);

  let y3 = document.createElement("TD");
  let t3 = document.createElement("INPUT");
  t3.setAttribute("type", "text");
  t3.setAttribute("placeholder", "Subjects");
  y3.appendChild(t3);

  let y4 = document.createElement("TD");
  let t4 = document.createElement("INPUT");
  t4.setAttribute("type", "text");
  t4.setAttribute("placeholder", "Year of Joining");
  y4.appendChild(t4);

  let y5 = document.createElement("TD");
  let t5 = document.createElement("INPUT");
  t5.setAttribute("type", "text");
  t5.setAttribute("placeholder", "Year of Graduation");
  y5.appendChild(t5);

  let y6 = document.createElement("TD");
  let t6 = document.createElement("INPUT");
  t6.setAttribute("type", "text");
  t6.setAttribute("placeholder", "Duration");
  y6.appendChild(t6);

  let y7 = document.createElement("TD");
  let t7 = document.createElement("INPUT");
  t7.setAttribute("type", "text");
  t7.setAttribute("placeholder", "Percentage");
  y7.appendChild(t7);

  let y8 = document.createElement("TD");
  let t8 = document.createElement("INPUT");
  t8.setAttribute("type", "text");
  t8.setAttribute("placeholder", "Percentage");
  y8.appendChild(t8);

  let y9 = document.createElement("TD");
  let t9 = document.createElement("BUTTON");
  t9.innerText="X";
  t9.style.color="red";
  t9.classList.add("deletebtn");
//   t9.setAttribute("font-size", "x-large");
  y9.appendChild(t9);


  x1.appendChild(y1);
  x1.appendChild(y2);
  x1.appendChild(y3);
  x1.appendChild(y4);
  x1.appendChild(y5);
  x1.appendChild(y6);
  x1.appendChild(y7);
  x1.appendChild(y8);
  x1.appendChild(y9);
  
});

function ondelete(e){
    if(!e.target.classList.contains("deletebtn")){
        return;
    }
    const deletebtn = e.target;
    deletebtn.closest("tr").remove();
}


table.addEventListener('click', ondelete);