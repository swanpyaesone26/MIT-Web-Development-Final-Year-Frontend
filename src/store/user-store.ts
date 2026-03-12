import API from "@/util/axiosInstance";
import {create} from 'zustand'
import { persist} from "zustand/middleware"
type AuthState = {
    user : User | null,
    token : string | null,
    setUser : (user : User | null)=> void,
    setToken : ( token : string)=> void,
    logIn : (token : string,user : User)=> void,
    logOut : ()=> void
}

export const useAuthStore = create<AuthState>()(
     persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      logIn: (token, user) => {
        set({ token, user });
      },

      logOut: () => {
        set({ user: null, token: null });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        delete API.defaults.headers.common["Authorization"];
      },
    }),
    {
      name: "auth-storage",
    }
  )
)