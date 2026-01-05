module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily:{
                noto: ['noto-sans', 'sans-serif' ],
                mundial: ['mundial', 'sans-serif' ],
                heveltica: ['heveltica', 'sans-serif'],
            },
            colors:{
                bgRivet: '#24262A',
                ftMasha: '#171B29',
            },
        },
    },
    plugins: [],
};  