const HtmlData = ({ data, className, isDark, style }: any) => {
  return (
    <>
      <small
        dangerouslySetInnerHTML={{ __html: data }}
        className={`${isDark ? "" : "paragraphs"} ${className}`}
        style={style}
      />
    </>
  );
};

export default HtmlData;
