const HtmlData = ({ data, className, isDark, style }: any) => {
  console.log("test>>")
  return (
    <>
      <span
        dangerouslySetInnerHTML={{ __html: data }}
        className={`${isDark ? "" : "paragraphs"} ${className || ""}`}
        style={style}
      />
    </>
  );
};

export default HtmlData;
