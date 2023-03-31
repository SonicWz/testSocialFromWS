import React from 'react';
import {Navigate} from 'react-router-dom';
import {connect} from "react-redux";

let mapStateToPropsRedirect = (state) => {
    return {
        isAuth: state.auth.isAuth,
    }
}

let withAuthRedirect = (Component) => {
	class RedirectComponent extends React.Component {
		render(){
			if (!this.props.isAuth){
				return <Navigate to="/login" /> 
			}
			return <Component {...this.props}/>
		}
	}
	// для того, чтобы забрать isAuth из стора. Чтобы не прокидывать его в каждый компонент
	let ConnectedRedirectComponent = connect(mapStateToPropsRedirect)(RedirectComponent);
	return ConnectedRedirectComponent
	
} 


export default withAuthRedirect