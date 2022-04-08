const fs=require('fs')

const login=(loginData)=>{
    const users=loadUsers()
    const validUser=users.find((user)=> user.email === loginData.email)
    if(validUser)
    {
        if(validUser.password === loginData.password)
        {
            return { status: true } 
        }
        return { status: false, message:" Invalid Password"}
    }
    return { status:false, message:"Invalid EmailId"};
}
const register=(registrationData)=>{
    const users=loadUsers();
    const duplicateUser=users.find((user)=> user.email===registrationData.email)
    if(!duplicateUser)
    {
        try
        {
            users.push({
                id:Math.random().toString(36).slice(2),
                name:registrationData.name,
                email:registrationData.email,
                password:registrationData.password,
            });
            saveUser(users)    
        }
        catch(error)
        {
            return { status:true, message:"Registration Failed Try Again Later", statusCode:409}
        }
        return { status:true, message:"Registration Successfull"}
    }
    else
    {
        return {stats:false, message:"Email Already Exists",statusCode:409}
    }
}

const remove=(userData)=>{
    const users=loadUsers();
    const isUser=users.find((user)=> user.id ===userData.id)
    if(isUser)
    {
        try
        {
            let updatedUsers=users.filter((user)=> user.id !== userData.id)
            saveUser(updatedUsers)
        }
        catch(error)
        {
            return {status: false,message:error, statusCode:409}
        }
        return {status:true,message:"User Deleted SuccessFully"}
    }
    else{
        return {stats:false, message:"User Does Not Exists",statusCode:409}
    }
}
const update=(userData)=>{
    const users=loadUsers();
    const isValidUser=users.find((user)=> user.id ===userData.id)
    if(isValidUser)
    {
        try
        {
            let updatedUsers=users.filter((user)=>user.id ===userData.id)
            updatedUsers.push(userData)
            saveUser(updatedUsers)
        }
        catch(error)
        {
            return {status: false,message:error, statusCode:409}
        }
        return {status:true,message:`User Updated SuccessFully` }
    }
    else
    {
        return {stats:false, message:"User Does Not Exists",statusCode:409}
    }
}
const saveUser=(userData)=>{
    const userDataJson=JSON.stringify(userData)
    fs.writeFileSync("users.json",userDataJson)
}
const loadUsers=()=>{
    try {
        const dataBuffer= fs.readFileSync("users.json")
        const dataJson=dataBuffer.toString()
        return JSON.parse(dataJson)
    } catch (error) {
        return []
    }
}

module.exports={
    login,
    register,
    remove,
    update,
}
