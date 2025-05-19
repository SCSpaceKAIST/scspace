"use client"

import {
    Table,
} from "@chakra-ui/react";
import Scroll from "../_commons/Scroll";
import { useLoginCheck } from "@scspace-client/APIs/auth/useLoginCheck";

export default function Organization() {
    const loginCheck = useLoginCheck();

    const items = [
        { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
        { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
        { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
        { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
        { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
        { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
        { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
        { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
        { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
        { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
        { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
        { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
        { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
        { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
        { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
        { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
        { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
        { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
        { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
        { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
        { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
        { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
        { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
        { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
        { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
    ]

    return (
        <Scroll>
            <Table.Root
                stickyHeader
                interactive
                colorPalette="blue"
            >
                <Table.Header >
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Create Time</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Show Detail</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items.map((item) => (
                        <Table.Row key={item.id}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.category}</Table.Cell>
                            <Table.Cell textAlign="end">{item.price}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Scroll>
    );
}