import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button,
    Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { departments, FULL_URL } from '../resources';
import axios from 'axios';
import OutcomeBanner from '../components/OutcomeBanner';

export default class Materials extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
            selectedDepartment: null,
            materialName: "",
            requestSuccess: null,
        };

        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.selectDepartment = this.selectDepartment.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.isFormFilled = this.isFormFilled.bind(this);
    }

    selectDepartment(id) {
        this.setState({selectedDepartment: id});
    }

    toggle() {
        this.setState({dropdownOpen: !this.state.dropdownOpen});
    }

    handleChange({ target }) {
        this.setState({
            [target.id]: target.value,
        });
    }

    handleClick() {
        const newMaterial = {
            name: this.state.materialName,
            department: this.state.selectedDepartment
        }
        axios.post(FULL_URL + '/material', newMaterial)
            .then(res => this.setState({
                requestSuccess: true,
                selectedDepartment: null,
                materialName: "",
            }))
            .catch(err => this.setState({requestSuccess: false}));
    }

    isFormFilled() {
        return this.state.selectedDepartment && this.state.materialName.length >= 0;
    }

    render() {
        const { requestSuccess } = this.state;

        return (
        <div>
            <OutcomeBanner requestSuccess={requestSuccess} />
            <Form>
                <FormGroup>
                    <Label for="materialName">Name</Label>
                    <Input
                        type="text"
                        name="materialName"
                        id="materialName"
                        placeholder="Material name"
                        value={this.state.materialName}
                        onChange={this.handleChange}
                        />
                </FormGroup>

                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                        {
                            this.state.selectedDepartment
                                ? this.state.selectedDepartment
                                : "Department"
                        }
                    </DropdownToggle>
                    <DropdownMenu>
                    {departments.map((department, i) =>
                        <DropdownItem
                            onClick={() => this.selectDepartment(department)}
                            key={i}>
                                {department}
                        </DropdownItem>)}
                    </DropdownMenu>
                </Dropdown>

                <Button
                    onClick={this.handleClick}
                    disabled={!this.isFormFilled()}
                    >Register</Button>
            </Form>
        </div>
        )
    }
}
