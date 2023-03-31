import React from 'react';
import {compose} from 'redux';
import Dialogs from "./dialogs";
import withAuthRedirect from '../../hoc/withAuthRedirect';

export default compose(
    withAuthRedirect      // first function
    )(Dialogs);  //object

