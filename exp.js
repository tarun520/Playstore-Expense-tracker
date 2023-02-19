
function savetolocalstorage(event)
{
    event.preventDefault()
    let amount=event.target.expense.value;
    let description=event.target.description.value;
    let choosecategory=event.target.choosecategory.value;
    

    let obj={
        amount,
        description,
        choosecategory
       
    }
    const token=localStorage.getItem('token')
    axios.post('http://localhost:3000/expenses/add',obj,{headers:{"Authorisation":token}})
    .then((res)=>{
        if(res===201)
        {
        showuserdetails(res.data.data)
        }
    })
    .catch((err)=>console.log(err))
    
    
}
function showuserdetails(data)
{
    document.getElementById('exp').value='';
    document.getElementById('des').value='';
    let parentele=document.getElementById('frm')
    let childele=`<li id=${data.id}>${data.amount}-${data.description}-${data.category}
                        <button class='btn btn-primary btn-sm' onClick=deluser('${data.id}')>delete</button>
                        <button class='btn btn-primary btn-sm' onClick=edituser('${data.amount}','${data.description}','${data.choosecategory}','${data._id}')>edit</button></li>`
    parentele.innerHTML=parentele.innerHTML+childele
    
}
function edituser(useramount,userdescription,choosecategory,userid)
{
    document.getElementById('exp').value=useramount;
    document.getElementById('des').value=userdescription;
    document.getElementById('cat').value=choosecategory;
    

    deluser(userid);

}
function deluser(userid)
{
    const token=localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expenses/delete/${userid}`,{headers:{'Authorisation':token}})
    .then(
        removeuser(userid))
    .catch((err)=>{
        console.log(err)
    })
}
function removeuser(userid)
{
    let parnode=document.getElementById('frm')
    let childnode=document.getElementById(userid)
    if(childnode)
    {
        parnode.removeChild(childnode);
    }
}
window.addEventListener('DOMContentLoaded',()=>
{
    const token=localStorage.getItem('token')
    axios.get('http://localhost:3000/expenses/getall',{headers:{'Authorisation':token}})
    .then((res)=>{
        console.log(res.data)
        for(var i=0;i<res.data.allexpenses.length;i++)
        {
            showuserdetails(res.data.allexpenses[i]);
        }
    })
})