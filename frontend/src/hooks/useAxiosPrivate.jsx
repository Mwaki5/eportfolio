import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import React from 'react'

const useAxiosPrivate = () => {
    const refresh = useRefreshToken()
    const { accessToken } = useAuth()

    useEffect(() => {
  
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                
                // Handle 401 Unauthorized (expired JWT) or 403 Forbidden
                if ((error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest?.sent) {
                    prevRequest.sent = true
                    
                    try {
                        const newAccessToken = await refresh()
                        if (newAccessToken) {
                            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                            return axiosPrivate(prevRequest)
                        }
                    } catch (refreshError) {
                        // Refresh failed - token mismatch or expired
                        // Don't redirect here, let the error handler in useRefreshToken handle it
                        return Promise.reject(error)
                    }
                }
                return Promise.reject(error)
            }
        )
        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept)
            axiosPrivate.interceptors.request.eject(requestIntercept)
        }
    }, [accessToken, refresh])

    return axiosPrivate
}
export default useAxiosPrivate
