import axios, { AxiosError, AxiosRequestConfig } from "axios";
import React, { useCallback, useEffect, useState } from 'react'

type UseAxiosResult<T> = {
    data: T | null;
    error: AxiosError | null;
    loading: boolean;
    refetch: () => Promise<void> | void;
}

type UseAxios<T> = {
    url: string;
    config?: AxiosRequestConfig;
}


export default function useAxios<T>(props: UseAxios<T>): UseAxiosResult<T> {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<AxiosError | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchData = useCallback(() => {
        setLoading(true)
        setError(null)

        axios(props.url, props.config)
            .then((res) => {
                setData(res.data)
            })
            .catch((err: AxiosError) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [props.url, JSON.stringify(props.config)])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, error, loading, refetch: fetchData }
}
