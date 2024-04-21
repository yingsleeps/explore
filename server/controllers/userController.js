const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { doc, setDoc, getDoc } = require("firebase/firestore");
const { auth, database } = require("../firebase");

// This the regex to check if its an email and password
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const hasNumber = /\d/;
const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;

const createUser = async(req, res) => {
    try {
        const { email, password } = await req.body;

        // Field Checks
        if (email === "" || password === ""){
            return res.status(400).json("Missing Fields");
        }
        if (!emailRegex.test(email)){
            return res.status(400).json("Invalid Email");
        }
        if (password.length < 6 || !hasNumber.test(password) || !hasUpperCase.test(password) || !hasLowerCase.test(password)){
            return res.status(400).json("Invalid Password")
        }

        var user;
        // User Creation
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                user = userCredentials.user.uid;
            })
            .catch((err) => {
                // Errors and if the email alrdy exists
                if (err.code === "auth/email-already-in-use")
                    return res.status(400).json("Email Already Exists")
                return res.status(500).json("Internal Error")
            })

        // Add the user to the users collection
        if (user){
            await setDoc(doc(database, 'users', user), {
                email: email
            })
                .catch(()=>{
                    return res.status(500).json("Internal Error")
                })
        }

        return res.status(200).json(user)
    } catch(err) {
        console.log(err);
        return res.status(500).json("Internal Error");
    }
}

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Field Checks
        if (email === "" || password === ""){
            return res.status(400).json("Missing Fields");
        }
        if (!emailRegex.test(email)){
            return res.status(400).json("Invalid Email");
        }
        if (password.length < 6 || !hasNumber.test(password) || !hasUpperCase.test(password) || !hasLowerCase.test(password)){
            return res.status(400).json("Invalid Password")
        }

        let userCredentials;
        try {
          userCredentials = await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
          console.error(err);
          throw new Error('Invalid Credentials');
        }

        const uid = userCredentials.user.uid;
        const userRef = doc(database, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error('User not found');
        }
        // TODO: Create an object to return to the phone
        
        return res.status(200).json(userDoc.data());
    } catch(err) {
        console.log(err);
        return res.status(500).json("Internal Error");
    }
}

const setUpUser = async() => {
    try {
        // TODO: Create a function to update user with new information
    } catch(err) {
        console.log(err);
        return res.status(500).json("Internal Error");
    }
}

const updateUser = async() => {
    try {
        // TODO: Create a function to change the user's settings
    } catch(err) {
        console.log(err);
        return res.status(500).json("Internal Error");
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    setUpUser
}