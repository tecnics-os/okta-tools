import { useState } from 'react'
import '../App.css'
import fileDownload from 'js-file-download';
const CertificateWithHeader = ()=> {

  const [certificate, setCertificate] = useState();
  const [certificateWithHeader, setCertificateWithHeader] = useState();
  const handleCertificate = (e)=> {
    setCertificate(e.target.value)
  }
  const formatCertificate = (e)=> {
    e.preventDefault();
    if(certificate === null || certificate === undefined){
      alert("Please enter a valid certificate")
    }else{
      fetch('http://127.0.0.1:5000/certificateWithHeader', {
          method: 'POST',
          body: certificate,
      })
      .then(res => res.json())
      .then(data => {
          setCertificateWithHeader(data)
      })
    }
    
  }
  const handleCertificateSave = ()=> {
    var date = new Date();
    let present_date = date.getDate() + "" + (date.getMonth() + 1) + "" + date.getUTCFullYear() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
    let fileName = `certificate${present_date}.txt`
    console.log(present_date)
    fileDownload(certificateWithHeader.data, fileName)
  }
    return <form>
        <div className="form-group">
          <div className="col-sm-4">
            <textarea id="certificate-text-area" className="form-control"  onChange={(e)=>{handleCertificate(e)}}></textarea>
            <br/>
            <button className="btn btn-primary" onClick={(e)=>{formatCertificate(e)}}>format certificate</button>
            {certificateWithHeader != null ? <p className="col-sm-10">{certificateWithHeader.certificate} <br/><button className="btn btn-primary" onClick={handleCertificateSave}>download certificate</button></p>: null}
          </div>
        </div>
    </form>

}
export default CertificateWithHeader
