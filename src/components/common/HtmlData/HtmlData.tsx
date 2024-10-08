const HtmlData = ({ data }:any) => {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: data }} className="paragraphs" />
      </>
    );
};
  
export default HtmlData;