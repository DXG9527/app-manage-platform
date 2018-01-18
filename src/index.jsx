import React from 'react';
import {hashHistory, Route, Router} from 'react-router';
import {render} from 'react-dom';
import {
    App,
    Home,
    LoginArea,
    MenuDesign,
    ParamDetail,
    ParamList,
    UmdDesignList,
    UpdDesignList,
    WidgetDetail,
    WidgetList,
    WidgetParam,
    AuthManage,
    UfdDesignList
} from 'amp';

/**
 * Main App View
 */

render(
    <Router history={hashHistory}>
        <Route path="/" component={LoginArea}/>
        <Route path="/app" component={App}>
            <Route path="/team" component={Home}/>
            <Route path="/training" component={UmdDesignList}/>
            <Route path="/oa/management" component={UpdDesignList}/>
            <Route path="/oa/salary" component={WidgetList}/>
            <Route path="/oa/check" component={WidgetDetail}/>
            <Route path="/contact" component={WidgetParam}/>
            <Route path="/settings" component={ParamList}/>
            <Route path="/service" component={ParamDetail}/>
        </Route>
    </Router>,
    document.getElementById('app')
);
