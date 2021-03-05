import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';

const withUser = (Wrapped : any) => {
    //To use functional components in HOC with HOOK, It should be structred like below.
    const WrappedComponent : React.FC<any> = (props : any) => {
        const [User, setUser] = useState(null);
        const user = useSelector((state: any) => state.UserReducer.User);
        useEffect(()=>{
            setUser(user);
        })
        if(User == null)
            return <div>You should login</div>
        
        return <Wrapped user = {User} {...props}></Wrapped>
    }
    return WrappedComponent
}

export default withUser