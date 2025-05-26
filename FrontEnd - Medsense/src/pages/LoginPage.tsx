import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function LoginPage(){

    const nav = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    
    function validateLogin() {
        
        setLoginError("");
        
        if (!email || !password) {
            setLoginError("Please enter both email and password");
            return;
        }
        
        const user = users.find(
            (user: User) => user.name === email || user.email === email
        );
        
        console.log("Found user:", user);

        if (user && user.password === password) {
            
            const userToStore = {
                id: user.id,
                name: user.name,
                email: user.email, 
                role: user.role
            };
            
            sessionStorage.setItem('user', JSON.stringify(userToStore));
            console.log("Login successful for user:", user);
            nav("/home-page");
        } else {
            
            setLoginError("Invalid email or password");
        }
    }

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios.get("http://localhost:3001/users")
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setUsers(res.data);
                    console.log("Fetched users:", res.data);
                } else {
                    console.warn("No users found in the response");
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Backend connection error:', err);
                setIsLoading(false);
            });
    }, [])

    return(
        <>
            <div className="flex flex-col justify-center items-center h-screen bg-sky-50">
                <div className="w-md flex flex-col justify-center border border-sky-500 px-10 py-5 shadow-lg bg-white">
                    <div className="w-100% flex items-center justify-center">
                        <h1 className="text-3xl font-bold text-sky-500 pb-7" >MedSense</h1>
                    </div>
                    <label htmlFor="email" className="text-sky-900 font-medium">Email</label>
                    <input 
                        className="border border-sky-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        type="text" 
                        name="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <label htmlFor="password" className="text-sky-900 font-medium">Password</label>
                    <input 
                        className="border border-sky-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        type="password" 
                        name="Password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    {loginError && (
                        <p className="text-red-500 text-sm mt-1">{loginError}</p>
                    )}
                    <div className="w-100% flex items-center justify-center mt-2">
                        <button 
                            className="w-1/2 border rounded-lg bg-sky-500 hover:bg-sky-400 transition-colors py-2 text-white font-bold shadow-md" 
                            type="button"
                            onClick={validateLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    </div>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={() => nav("/register")}
                            className="text-sky-500 hover:text-sky-500 font-medium"
                        >
                            Register Now
                        </button>
                    </div>
                </div>    
            </div>

            {/* Tutorial pengunaan app */}

        </>
    )
}
