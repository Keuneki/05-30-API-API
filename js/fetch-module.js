export async function getServerData(dataForm) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/${dataForm}`);
    const data = await res.json();
    return data;
};
