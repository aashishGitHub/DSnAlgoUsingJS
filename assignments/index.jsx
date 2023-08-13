// React is loaded and is available as React and ReactDOM
// imports should NOT be used


document.body.innerHTML = "<div id='root'> </div>";

const rootElement = document.getElementById("root");
const links = ["https://bit.ly/3lmYVna", "https://bit.ly/3flyaMj"];
const root = ReactDOM.createRoot(rootElement);
const [linkList, setLinkList] = React.useState(links);

const handleRemove = (index) => {
    const newList = linkList.filter((_ln, ix) => index != ix);
    setLinkList(newList);
}
const ImageGallery = ({ links }) => {
    return links.map((link, index) => {
        <div className="image" key={index}>
            <img src={link}></img>
            <button className="remove" onClick={() => handleRemove(index)}>X</button>
        </div>
    })

}
root.render(
    <ImageGallery links={linkList} />);

setTimeout(() => {
    document.querySelectorAll('.remove')[0]?.click();
    setTimeout(() => {
        console.log(rootElement?.innerHTML);
    });
});