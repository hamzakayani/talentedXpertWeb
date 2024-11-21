const HtmlData = ({ data, className }:any) => {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: data }} className={`paragraphs ${className}`} />
      </>
    );
};
  
export default HtmlData;