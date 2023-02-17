async function submitdetails(e)
{
    try{
    e.preventDefault()
    let signupdetails={
    name:e.target.name.value,
    email:e.target.email.value,
    password:e.target.password.value,
    }

    const response=await axios.post('http://localhost:3000/user/signup',signupdetails)
    if(response.status===201)
    {
        window.location.href='../login/login.html'
    }
    else{
        throw new Error('failed to login');
    }
}
catch(err){
    console.log(err)
}
    
}