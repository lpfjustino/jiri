import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { FULL_URL } from '../resources';
import axios from 'axios';
import _ from 'underscore';
import OutcomeBanner from '../components/OutcomeBanner';

export default class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedMaterial: null,
            productRef: "",
            productModel: "",
            productColor: "",
            productMaterials: [],
            materials: [],
            requestSuccess: null,
        };

        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleInclude = this.handleInclude.bind(this);
        this.handleMaterialSelection = this.handleMaterialSelection.bind(this);
        this.selectDepartment = this.selectDepartment.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.isItemPresent = this.isItemPresent.bind(this);
        this.isFormFilled = this.isFormFilled.bind(this);
    }

    componentWillMount() {
        axios.get(FULL_URL + '/material')
            .then(res => this.setState({ materials: res.data }))
            .catch(err => this.setState({ requestSuccess: false }));
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
        const newProduct = {
            model: this.state.productModel,
            ref: this.state.productRef,
            color: this.state.productColor,
            materials: this.state.productMaterials
        }

        axios.post(FULL_URL + '/product', newProduct)
            .then(res => 
                this.setState({
                    selectedMaterial: null,
                    productRef: "",
                    productModel: "",
                    productColor: "",
                    productMaterials: [],
                    requestSuccess: true,
                }))
            .catch(err => this.setState({requestSuccess: false}));
    }

    handleInclude() {
        const { productMaterials, materials, selectedMaterial } = this.state;
        const isItemPresent = this.isItemPresent();
        const remainingMaterials = _.without(materials, materials[selectedMaterial])

        if (!isItemPresent) {
            productMaterials.push(materials[selectedMaterial]);
            this.setState({
                productMaterials,
                materials: remainingMaterials
            });
        }
    }
    
    isItemPresent() {
        const { productMaterials, materials, selectedMaterial } = this.state;
        const isItemPresent = _.contains(productMaterials, materials[selectedMaterial]);
        return isItemPresent;
    }

    isFormFilled() {
        return this.state.productRef.length > 0 &&
            this.state.productModel.length > 0 &&
            this.state.productColor.length > 0 &&
            this.state.productMaterials.length > 0;
    }

    handleMaterialSelection({ target }) {
        this.setState({
            selectedMaterial: target.index,
        });
    }

    renderSelectedMaterials() {
        return this.state.productMaterials && this.state.productMaterials.length > 0 &&
            this.state.productMaterials.map((material, i) => <li key={i}>{material.name}</li>)
    }

    render() {
        const { requestSuccess } = this.state;

        return (
        <div>
            <OutcomeBanner requestSuccess={requestSuccess} />
            <Form>
                <FormGroup>
                    <Label for="productRef">Ref</Label>
                    <Input
                        type="text"
                        name="productRef"
                        id="productRef"
                        placeholder="Product ref"
                        value={this.state.productRef}
                        onChange={this.handleChange}
                        />
                </FormGroup>

                <FormGroup>
                    <Label for="productModel">Model</Label>
                    <Input
                        type="text"
                        name="productModel"
                        id="productModel"
                        placeholder="Product model"
                        value={this.state.productModel}
                        onChange={this.handleChange}
                        />
                </FormGroup>

                <FormGroup>
                    <Label for="productColor">Color</Label>
                    <Input
                        type="text"
                        name="productColor"
                        id="productColor"
                        placeholder="Product color"
                        value={this.state.productColor}
                        onChange={this.handleChange}
                        />
                </FormGroup>

                <FormGroup>
                    <Label for="selectedMaterial">Materials</Label>
                    <Input
                        type="select"
                        name="selectedMaterial"
                        id="selectedMaterial"
                        multiple
                        onClick={this.handleMaterialSelection}
                        >
                        {this.state.materials.map((material, i) => <option key={i}>{material.name}</option>)}
                    </Input>
                    <ol>
                        {this.renderSelectedMaterials()}
                    </ol>
                </FormGroup>
                <Button
                    onClick={this.handleInclude}
                    disabled={this.isItemPresent()}
                    >Include</Button>

                <Button
                    onClick={this.handleClick}
                    disabled={!this.isFormFilled()}
                    >Register</Button>
            </Form>
        </div>
        )
    }
}
