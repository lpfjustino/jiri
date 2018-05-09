import React, { Component } from 'react';
import { Button, Row, Jumbotron } from 'reactstrap';
import axios from 'axios';
import _ from 'underscore';
import { FULL_URL } from '../resources';

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "orders": [],
            "products": [],
            "materials": [],
            "maps": [],
            "triage": {},
            "chosenMap": null,
            "chosenMapOrders": [],
            "triage": {},
        }

        this.saveMap = this.saveMap.bind(this);
        this.computeTriage = this.computeTriage.bind(this);
    }

    renderProduct(product, sizes, j) {
        return(
                <tr key={j}>
                    <td>{product.ref}</td>
                    <td>{product.model}</td>
                    <td>{product.color}</td>
                    <td>{sizes["size_34"]}</td>
                    <td>{sizes["size_35"]}</td>
                    <td>{sizes["size_36"]}</td>
                    <td>{sizes["size_37"]}</td>
                    <td>{sizes["size_38"]}</td>
                    <td>{sizes["size_39"]}</td>
                    <td>{sizes["total"]}</td>
                </tr>
        );
    }

    fetchAllData() {
        axios.get(FULL_URL + "/material")
            .then(res => this.setState({ "materials": res.data }))

        axios.get(FULL_URL + "/product")
            .then(res => {
                const products = res.data;
                this.setState({ products })
            });
            
        axios.get(FULL_URL + "/order")
            .then(res => {
                const orders = res.data;
                const unassignedOrders = _.filter(orders, order => order.map == null);
                const triage = this.computeTriage(unassignedOrders);
                
                this.setState({
                    orders,
                    chosenMapOrders: unassignedOrders,
                    triage,
                });
        });

        axios.get(FULL_URL + "/map")
            .then(res => {
                const maps = res.data;
                this.setState({ maps });
            });
    }

    componentWillMount() {
        this.fetchAllData();
    }

    saveMap() {
        const { orders } = this.state;
        const newOrders = _.filter(orders, order => order.map == null);

        if(newOrders.length > 0) {
            axios.post(FULL_URL + "/map", newOrders)
                .then(res => {
                    this.fetchAllData();
                });
        }
    }

    chooseMap(map) {
        const { orders } = this.state;
        const mapId = map ? map.id : null;
        const chosenMapOrders = _.filter(orders, order => order.map == mapId);
        const triage = this.computeTriage(chosenMapOrders);

        this.setState({
            chosenMap: map,
            chosenMapOrders,
            triage,
        });
    }

    computeTriage(orders) {
        const triage = {};

        orders.forEach(order => {
            const { logo } = order;
            const orderProducts = order.products;

            if (!triage[logo]) {
                triage[logo] = {};
            }
            
            orderProducts.forEach(product => {
                if (!triage[logo][product.id]) {
                    triage[logo][product.id] = {
                        "size_34": 0,
                        "size_35": 0,
                        "size_36": 0,
                        "size_37": 0,
                        "size_38": 0,
                        "size_39": 0,
                    };
                }

                triage[logo][product.id] = {
                    "size_34": triage[logo][product.id]["size_34"] + product["size_34"],
                    "size_35": triage[logo][product.id]["size_35"] + product["size_35"],
                    "size_36": triage[logo][product.id]["size_36"] + product["size_36"],
                    "size_37": triage[logo][product.id]["size_37"] + product["size_37"],
                    "size_38": triage[logo][product.id]["size_38"] + product["size_38"],
                    "size_39": triage[logo][product.id]["size_39"] + product["size_39"],
                }
            })
        });

        return triage;
    }
    
    render() {
        const { chosenMapOrders, maps, chosenMap, triage, products } = this.state;
        const logos = Object.keys(triage);

        return (
            <div>
                <Jumbotron>
                <Row>
                    <Button
                        onClick={this.saveMap}
                        >Save</Button>
                </Row>
                <Row>
                    {
                        maps.map((map, i) => 
                            <Button
                                onClick={() => this.chooseMap(map)}
                                color={chosenMap === map ? "primary" : "secondary"}
                                >{map.id}</Button>
                        )
                    }
                    {
                        <Button
                            onClick={() => this.chooseMap(null)}
                            color={chosenMap === null ? "primary" : "secondary"}
                            >New Map</Button>   
                    }
                </Row>
                {
                    logos.map((logo, i) => {
                        const productsIds = Object.keys(triage[logo]);
                        return(
                            <div key={i}>
                                <h1>{ logo }</h1>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ref</th>
                                            <th>Model</th>
                                            <th>Color</th>
                                            <th>34</th>
                                            <th>35</th>
                                            <th>36</th>
                                            <th>37</th>
                                            <th>38</th>
                                            <th>39</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                {
                                    productsIds.map((productId, j) => {
                                        const fullProduct = _.find(products, prod => prod.id == productId);
                                        const product = {
                                            ...triage[logo][productId],
                                            ...fullProduct,
                                        };

                                        const sizes = {
                                            "size_34": product["size_34"],
                                            "size_35": product["size_35"],
                                            "size_36": product["size_36"],
                                            "size_37": product["size_37"],
                                            "size_38": product["size_38"],
                                            "size_39": product["size_39"],
                                            "total": product["size_34"]
                                                        + product["size_35"]
                                                        + product["size_36"]
                                                        + product["size_37"]
                                                        + product["size_38"]
                                                        + product["size_39"]
                                        };

                                        // if (!order.products || order.products.length === 0) {
                                        //     return <div></div>;
                                        // }
                                        return this.renderProduct(product, sizes, j);
                                    })
                                }
                                    </tbody>
                                </table>
                            </div>
                        );
                    })
                }
                </Jumbotron>
            </div>
        )
    }
}
