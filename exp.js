const token = localStorage.getItem('token')
const limit=document.getElementById('rows').value
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
        
        showuserdetails(res.data.data)
    })
    .catch((err)=>console.log(err))
    
    
}
function showuserdetails(data)
{
    // parentele.innerHTML=''
    // document.getElementById('exp').value='';
    // document.getElementById('des').value='';

    let parentele=document.getElementById('frm')
    let childele=''
    childele=`<li id=${data.id}>${data.amount}-${data.description}-${data.category}
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
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
window.addEventListener('DOMContentLoaded',()=>
{
  
    const token=localStorage.getItem('token')
    const pruser=parseJwt(token)
    if(pruser.ispremiumuser)
    {
    document.getElementById('message').innerHTML="you are a premium user now"
    document.getElementById('prm').style.visibility="hidden"
    showleaderboard()
    }
   
    const page=1;
    axios.get(`http://localhost:3000/expenses/getall?page=${page}&limit=${limit}`,{headers:{'Authorisation':token}})
    .then((res)=>{
        console.log(res.data)
        for(var i=0;i<res.data.allexpenses.length;i++)
        {
            showuserdetails(res.data.allexpenses[i]);
        }
        showpagination(res.data)
        
        

    })
})
const  pagination=document.getElementById('pagination')
function showpagination({
    currentpage,
    hasnextpage,
    nextpage,
    haspreviouspage,
    previouspage,
    lastpage
})
{
    
    pagination.innerHTML=''
    if(haspreviouspage)
    {
        const btn2=document.createElement('button')
        btn2.innerHTML=previouspage
        btn2.addEventListener('click',()=>
        {getall(previouspage);
        })
        pagination.appendChild(btn2)
    }
    const btn1=document.createElement('button')
    btn1.innerHTML=currentpage
    btn1.addEventListener('click',()=>{getall(currentpage)})
    pagination.appendChild(btn1)
    if(hasnextpage)
    {
        const btn3=document.createElement('button')
        btn3.innerHTML=nextpage
        btn3.addEventListener('click',()=>{getall(nextpage)})
        pagination.appendChild(btn3)
    }
    
}
async function getall(page)
{
    axios.get(`http://localhost:3000/expenses/getall?page=${page}&limit=${limit}`,{headers:{'Authorisation':token}})
    .then((res)=>{
        
        for(var i=0;i<res.data.allexpenses.length;i++)
        {   
            
            showuserdetails(res.data.allexpenses[i]);
        }
        showpagination(res.data)
    })
}
document.getElementById('prm').onclick=async function(e){
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/premium/premiummembership',{headers:{'Authorisation':token}})
    const options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response){
          const res=await axios.post('http://localhost:3000/updatetransactionstatus',
            {
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id
            },{headers:{'Authorisation':token}})
            localStorage.setItem('token',res.data.token)
            alert('you are premiumuser now')
            document.getElementById('message').innerHTML="you are a premium user now"
    document.getElementById('prm').style.visibility="hidden"
            showleaderboard()
        }
        
    } 

  
   
    
    const rzp=new Razorpay(options);
       rzp.open();
       e.preventDefault()
    rzp.on('payment.failed',function(response){
        alert('oops something went wrong')
    })

}
function download()
{
    // const token=localStorage.getItem('token')
    axios.get('http://localhost:3000/user/download',{headers:{'Authorisation':token}})
    .then((res)=>{
        if(res.status===201)
        {
            var a=document.createElement("a");
            a.href=res.data.fileurl;
            a.download="myexpense.csv";
            a.click();
        }
        else {
            throw new Error(res.data.message)
        }
    })
    .catch((err)=>{
        showError(err)
    })
}
function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}


function showleaderboard()
{
    const inputelement=document.createElement('input');
    inputelement.type="button";
    inputelement.value="show leaderboard"
    inputelement.onclick=async()=>{
        inputelement.style.visibility='hidden'
        let token=localStorage.getItem('token')
        const response=await axios.get('http://localhost:3000/premium/leaderboard',{headers:{'Authorisation':token}})
        var leaderboardele=document.getElementById('leaderboard')
        leaderboardele.innerHTML+=`<h1>Leader Board</h1>`
        
        response.data.forEach((arrofuserexpenses)=>{
            leaderboardele.innerHTML+=`<li>name:${arrofuserexpenses.name}-totalexpenses${arrofuserexpenses.totalexpenses}</li>`
        })

    }
    document.getElementById('message').appendChild(inputelement)
}