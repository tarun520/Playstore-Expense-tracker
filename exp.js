
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
    axios.get('http://localhost:3000/expenses/getall',{headers:{'Authorisation':token}})
    .then((res)=>{
        console.log(res.data)
        for(var i=0;i<res.data.allexpenses.length;i++)
        {
            showuserdetails(res.data.allexpenses[i]);
        }
    })
})
document.getElementById('prm').onclick=async function(e){
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/premium/premiummembership',{headers:{'Authorisation':token}})
    const options={
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler":async function(response){
            await axios.post('http://localhost:3000/updatetransactionstatus',
            {
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id
            },{headers:{'Authorisation':token}})

            alert('you are premiumuser now')
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


function showleaderboard()
{
    const inputelement=document.createElement('input');
    inputelement.type="button";
    inputelement.value="show leaderboard"
    inputelement.onclick=async()=>{
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
