import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';

const withUser = (Wrapped : any, allowNullUser = false) => {
    //To use functional components in HOC with HOOK, It should be structred like below.
    const WrappedComponent : React.FC<any> = (props : any) => {
        const user = useSelector((state: any) => state.UserReducer.User);
        const UserLoaded = useSelector((state: any) => state.UserReducer.isUserLoaded)

        if (Object.entries(user.toJS()).length == 0) {
            if(allowNullUser) {
                return <Wrapped user = {null} IsUserLoaded = {UserLoaded} {...props}></Wrapped>
            }
            else {
                return <div>You should login</div>
            }
        }        
        return <Wrapped user = {user} IsUserLoaded = {UserLoaded} {...props}></Wrapped>
        
    }
    return WrappedComponent
}

export default withUser