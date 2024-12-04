

export default function Header() {
return (
    <div className="row fixed-top">
        <div className="col">
        <h1
            style={{
                fontWeight: "300",
                fontSize: "16px",
                margin: "0",
                height: "50px",
                lineHeight: "50px",
                backgroundColor: "#5D2AC6",
                
            }}
            className="text-white w-100 ps-3"
        >
            Make Agent <small className="border rounded ms-1" style={{ fontSize: "12px", padding: "2px", fontWeight: "200" }}>Beta</small>
        </h1>
        </div>
    </div>
);
}
