import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { sizes } from '../resources';

import _ from 'underscore';

export default class ProductsTable extends Component {
    constructor(props) {
        super(props);

        this.renderSizes = this.renderSizes.bind(this);
        this.getOrders = this.getOrders.bind(this);
    }

    renderSizes() {
        return sizes.map((size, i) => <th key={i}>{size}</th>);
    }

    getOrders() {
        return this.props.items.map((order, i) => {
            const sizes = Object.keys(order.sizes);
            return <tr key={i}>
            <td>{order.ref}</td>
            <td className="model-column">{order.model}</td>
            <td className="color-column">{order.color}</td>
            {sizes.map((size, j) =>
                <td key={j}>
                    <Input
                        type="text"
                        value={this.props.items[i].sizes[size]}
                        className="quantity-input"
                        name={`${order.ref}-${size}`}
                        onChange={(event) => this.props.handleOrderChange(i, size, event.target.value)}
                        />
                </td>
                )
            }
            </tr>
        });
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                    <th>
                        Ref
                    </th>
                    <th>
                        Model
                    </th>
                    <th>
                        Color
                    </th>
                    {this.renderSizes()}
                    </tr>
                    {this.getOrders()}
                </tbody>
            </table>
        );
    }
}
