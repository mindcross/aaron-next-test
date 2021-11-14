import path from 'path';
import fs from 'fs/promises';

import { Fragment} from "react";

function ProductDetailPage(props) {
    if(!props.loadedProduct) {
        return <div>NOT FOUND</div>
    }

    return <div>
        <h1>{props.loadedProduct.title}</h1>
        <p>{props.date}</p>
    </div>
}

async function getData() {
    console.log('getData');
    const filePath = path.join(process.cwd(), 'data', 'dummy-products.json');
    const jsonData = await fs.readFile(filePath);
    const data = JSON.parse(jsonData);

    return data;
}

export async function getStaticProps(context) {
    console.log('Regenerating product page...' + new Date());
    console.log(context);
    const { params } = context;

    const productId = params.productid;

    const data = await getData();

    const product = data.products.find((product) => product.id == productId);

    if (!product) {
        return { notFound: true };
    }

    return {
        props: {
            loadedProduct: product,
            date: new Date().toString()
        },
        revalidate: 10,
    };
}

export async function getStaticPaths() {
    const data = await getData();

    const ids = data.products.map((product) => product.id);
    //const pathsWithParams = ids.map((id) => ({ params: { productid: id } }));

    const pathsWithParams = [{params: {productid:"1"}}, {params: {productid:"2"}}];

    console.log('PATHS WITH PARAMS: ' + JSON.stringify(pathsWithParams));

    return {
        paths: pathsWithParams,
        fallback: 'blocking', //generate on first visit if it doesn't already exist and browser waits for generation
    };
}

export default ProductDetailPage;