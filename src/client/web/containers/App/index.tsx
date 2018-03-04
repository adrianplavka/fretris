
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import { Auth, SoloPlayground, DuoPlayground } from '../'
import { RootState } from '../../reducers/store';

namespace AppComponent {
    export interface StateProps {
        context: JSX.Element
    }

    export type Props = StateProps;
}

function mapStateToProps(state: RootState) {
    let context: JSX.Element;
    switch (state.app.context) {
        case "Auth":
            context = <Auth />;
            break;
        case "SoloPlayground":
            context = <SoloPlayground />;
            break;
        case "DuoPlayground":
            context = <DuoPlayground id={state.app.id} username={state.app.username} />
            break;
        default:
            context = <div />;
    }

    return {
        context: context
    };
}

function mapDispatchToProps(dispatch: any) {
    return {};
}

export class AppComponent extends React.Component<AppComponent.Props, {}> {
    constructor(props: AppComponent.Props) {
        super(props);
    }

    render() {
        return <div id="main-container">{this.props.context}</div>;
    }
}

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
