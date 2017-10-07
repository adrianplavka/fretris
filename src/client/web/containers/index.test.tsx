
import * as React from 'react';
import * as enzyme from 'enzyme';

import { initEnzyme } from '../utils/enzyme';
import { Workspace } from './';

initEnzyme();
describe("Containers", () => {
    describe("Workspace", () => {
        it("should render", () => {
            enzyme.shallow(<Workspace />);
        });

        const wrapper = enzyme.shallow(<Workspace />);

        it("should contain a greeting", () => {
            expect(wrapper.contains(<h1>Try Gittie!</h1>)).toBeTruthy();
        });
    });
});
