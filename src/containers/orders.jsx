import React, { Component } from 'react'
import {
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button,
    Input, Label, FormGroup
} from 'reactstrap';
import { sizes, arrayToObject, FULL_URL } from '../resources';

import ProductsTable from '../components/ProductsTable';
import OutcomeBanner from '../components/OutcomeBanner';

import _ from 'underscore';
import axios from 'axios';

export default class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            selected: null,
            dropdownOpen: false,
            products: [],
            logo: "",
            requestSuccess: null,
        };

        this.toggle = this.toggle.bind(this);
        this.selectProduct = this.selectProduct.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        axios.get(FULL_URL + "/product")
            .then(res => {
                const products = res.data;
                console.log(products.length)
                console.log(products)
                this.setState({
                    products: res.data
                });
            } )
    }

    handleClick() {
        const { items, products } = this.state;
        const product = _.find(products, el => el.id === this.state.selected.id);

        // Initialize sizes as zeroes
        const initialSizes = sizes.map(size => {
            return {[`size_${size}`]: 0}
        }).reduce(arrayToObject, {});

        const orderItem = {
            ...product,
            sizes: initialSizes
        };

        items.push(orderItem);
        this.setState({items});
    }

    handleChange({ target }) {
        this.setState({
            [target.id]: target.value,
        });
    }

    handleSubmit() {
        const { logo } = this.state;
        const products = this.state.items.map(item => {
            const { id, sizes } = item;
            return {
                id,
                sizes,
            };
        });
        const newOrder = {
            products,
            logo
        };

        axios.post(FULL_URL + "/order", newOrder)
            .then(res => this.setState({
                requestSuccess: true,
                items: [],
                selected: null,
                dropdownOpen: false,
                logo: "",
            }))
            .catch(err => this.setState({requestSuccess: false}));
    }

    toggle() {
        this.setState({dropdownOpen: !this.state.dropdownOpen});
    }

    handleOrderChange(i, size, value) {
        const { items } = this.state;
        items[i].sizes[size] = value;
        this.setState({ items });
    }

    selectProduct(id) {
        const { products } = this.state;
        const product = _.find(products, product => product.id === id);
        this.setState({selected: product});
    }
    
    render() {
        const { requestSuccess, selected, dropdownOpen, products, logo } = this.state;
        return (
            <div>
                <OutcomeBanner requestSuccess={requestSuccess} />
                <ProductsTable
                    items={this.state.items}
                    handleOrderChange={this.handleOrderChange}
                    />

                <div className="add-product">
                    <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
                        {selected
                            ? `(${selected.ref}) ${selected.model} ${selected.color}`
                            : "Product"
                        }
                        </DropdownToggle>
                        <DropdownMenu>
                        {products.map((product, i) =>
                            <DropdownItem
                                onClick={() => this.selectProduct(product.id)}
                                key={i}>
                                    {`(${product.ref}) ${product.model} ${product.color}`}
                            </DropdownItem>)}
                        </DropdownMenu>
                    </Dropdown>

                    <Button
                        onClick={this.handleClick}
                        disabled={selected === null}
                        >Add</Button>
                </div>

                <FormGroup>
                    <Label for="logo">Label</Label>
                    <Input
                        type="text"
                        name="logo"
                        id="logo"
                        placeholder="Product Logo"
                        value={logo}
                        onChange={this.handleChange}
                        />
                </FormGroup>

                <Button
                        onClick={this.handleSubmit}
                        >Submit</Button>
            </div>
        );
    }
}
