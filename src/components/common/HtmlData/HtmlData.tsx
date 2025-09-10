const HtmlData = ({ data, className, isDark, style }:any) => {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: data }} className={`${isDark ? '' : 'paragraphs'} ${className}`} style={style} />
      </>
    );
};
  
export default HtmlData;