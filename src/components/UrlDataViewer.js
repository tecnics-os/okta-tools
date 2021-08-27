import { Link } from "react-router-dom"

const UrlDataViewer = (props) => {
    const url = props.url
    return (<div>
        <Link>{url.request.url}</Link>
        </div>)
}
export default UrlDataViewer
