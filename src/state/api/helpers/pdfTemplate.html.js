export const htmlTemplate = `
<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.2/css/bootstrap.min.css" />
  <style>

page {
  background: white;
  display: block;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 1cm;
  
}
page[size="A4"] {  
  width: 21cm;
  height: 29.7cm; 
}
.page-border {
  width: 100%;
  height: 100%;
  border: 1px solid silver;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 15px;
}
section {padding: 20px 30px;}
.logo-yoda {width: 150px}
.page-title-text {font-size: 80px; color: #760f4e;}
.page-title-coursename {font-size: 30px; font-weight: 600;color: #760f4e;}
.signature-img {padding: 20px;}
.signature {width: 200px;}
table {
  width: 100%;
  border-collapse: collapse;
}
  </style>
</head>
<body>
<page size="A4">
  <div class="page-border">
    <section class="page-logo text-center">
      <img class="" alt="logo-e-wise.png" src="https://storage.cloud.google.com/ewise-public-files/signature/logos/logo-e-wise.png" >
    </section>
    <section class="page-title">
      <div class="page-title-text text-center">Certificaat</div>
      <div class="page-title-cursist text-center">De heer M. Op de Coul heeft de cursus</div>
      <div class="page-title-coursename text-center">Master Jedi voor gevorderden</div>
      <div class="page-title-coursestatus text-center">succesvol afgerond</div> 
    </section>
    <section class="border-top">
      <div class="container">
        <div class="row d-flex align-items-center">
          <div class="col text-center  ">
            <div class="waarde fw-bold ">Herregistratiewaarde</div>
             <div class="punten">1 punt</div>
          </div>
          <div class="col text-center">
            <div class="logo-register">
              <img class="logo-yoda" alt="logo-e-wise.png" src="https://storage.googleapis.com/ewise-public-files/testing/yoda.png" sandboxuid="0">
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="border-top">
      <div class="container">
        <div class="row">
          <div class="col text-center">
            <div class="waarde fw-bold">Datum behaald:</div>
             <div class="punten">1 mei 2022</div>
          </div>
          <div class="col text-center">
             <div class="waarde fw-bold">Geboortedatum:</div>
             <div class="punten">1 augustus 2020</div>
          </div>
        </div>
      </div>
    </section>
    <section class="page-signature border-top text-center">
      <div class="signature-img text-center">
        <img class="signature" src="https://storage.googleapis.com/ewise-public-files/testing/transparant-signature.png">
      </div>
      <div class="signature-name fw-bold text-center">Hans van Veggel</div>
      <div class="sinature-function text-center">Directeur E-WISE Nederland bv</div>   
    </section>
    <section class="border-top">
      <div class="text-center"><span class="fw-bold">Certificaatnummer: </span><span>2173108</span></div>      
    </section>
  </div>
</page>
</body>
`;
