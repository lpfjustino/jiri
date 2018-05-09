import React, { Component } from 'react';

import axios from 'axios';
import _ from 'underscore';
import { FULL_URL } from '../resources';

export default class CutterReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "orders": [],
            "products": [],
            "materials": [],
            "triage": {}
        }
    }

    renderSizes(material, sizes) {
        const total = sizes["size_34"]
        + sizes["size_35"]
        + sizes["size_36"]
        + sizes["size_37"]
        + sizes["size_38"]
        + sizes["size_39"]

        return(
                <tr>
                    <td>{material.id}</td>
                    <td>{material.name}</td>
                    <td>{sizes["size_34"]}</td>
                    <td>{sizes["size_35"]}</td>
                    <td>{sizes["size_36"]}</td>
                    <td>{sizes["size_37"]}</td>
                    <td>{sizes["size_38"]}</td>
                    <td>{sizes["size_39"]}</td>
                    <td>{total}</td>
                </tr>
        );
    }

    componentWillMount() {
        axios.get(FULL_URL + "/material")
            .then(res => {
                const materials = res.data;
                const filteredMaterials = _.filter(materials, mat => mat.department === "Cortador");
                this.setState({ "materials": filteredMaterials })
            });
        const triage = {};

        axios.get(FULL_URL + "/product")
        .then(res => {
            const products = res.data;
            this.setState({ products });
            
            axios.get(FULL_URL + "/order")
            .then(res => {
                const orders = res.data;
                this.setState({ orders });
                
                orders.forEach(order => {
                    const orderProducts = order.products;
                    orderProducts.forEach(orderProduct => {
                        const fullProduct = _.find(products, prod => prod.id === orderProduct.id);
                        const model = fullProduct.model;
                        if (!triage[model]) {
                            triage[model] = {};
                        }
                        fullProduct.materials.forEach(material => {
                            if(material.department != "Cortador") {
                                return;
                            }
                            if (!triage[model][material.id]) {
                                triage[model][material.id] = {
                                    "size_34": 0,
                                    "size_35": 0,
                                    "size_36": 0,
                                    "size_37": 0,
                                    "size_38": 0,
                                    "size_39": 0,
                                };
                            }

                            triage[model][material.id] = {
                                "size_34": triage[model][material.id]["size_34"] + orderProduct["size_34"],
                                "size_35": triage[model][material.id]["size_35"] + orderProduct["size_35"],
                                "size_36": triage[model][material.id]["size_36"] + orderProduct["size_36"],
                                "size_37": triage[model][material.id]["size_37"] + orderProduct["size_37"],
                                "size_38": triage[model][material.id]["size_38"] + orderProduct["size_38"],
                                "size_39": triage[model][material.id]["size_39"] + orderProduct["size_39"],
                            }
                        })
                    });
                });
                this.setState({ triage });
            });
        })
    }
    
    render() {
        const { triage } = this.state;
        return (
            <div>
                {
                    Object.keys(triage).map((model, i) => {
                        return(
                            <div key={i}>
                                <h1>{ model }</h1>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ref</th>
                                            <th>Model</th>
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
                                    Object.keys(triage[model]).map((materialId, j) => {
                                        const { materials } = this.state;
                                        const material = _.find(materials, mat => mat.id == materialId);
                                        const sizes = triage[model][materialId];
                                        
                                        if (!materials || materials.length === 0) {
                                            return <div></div>;
                                        }
                                        return this.renderSizes(material, sizes);
                                    })
                                }
                                    </tbody>
                                </table>
                            </div>
                        );
                    })
                }
                
            </div>
        )
    }
}
