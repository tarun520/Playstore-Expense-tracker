async function onlogin(e)
{
    e.preventDefault()
    let logindetails={
    email:e.target.email.value,
    password:e.target.password.value
    }
    axios.post('http://localhost:3000/user/login',logindetails)
    .then((response)=>{
        if(response.status===201)
        {
            alert(response.data.message)
            localStorage.setItem('token',response.data.token)
            window.location.href='./exp.html'
        }
        else{
            throw new Error(response.data.message)
        }
    })
    .catch(err=>{
        document.body.innerHTML += `<div style='color:red;'>${err}</div>`;
    })
}
// document.getElementById('forgot-pass').onclick=async function(e)
// {
//     l
//     await axios.get('http://localhost:3000//password/forgotpassword')
// }