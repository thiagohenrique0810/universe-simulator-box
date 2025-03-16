/**
 * Favicon estático para o simulador do sistema solar
 * Este arquivo fornece um favicon básico como fallback caso o dinâmico falhe
 */

// Função para aplicar um favicon estático ao documento
function applyStaticFavicon() {
    console.log('Aplicando favicon estático...');
    
    // Remover favicon existente, se houver
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
        document.head.removeChild(existingFavicon);
    }
    
    // Criar um favicon simples usando um emoji de planeta como base64
    // Esta é uma imagem pré-definida de um planeta para evitar criar um canvas
    const staticFaviconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFDklEQVR4AcWWA5QkSxCGv+7Z7bVt27Zt27Zt2979bdu2bdu2nV8nnpm+m+rtbr+X8UVkR2ZURlZURlTk0OGDkydOkLxnzw6XLFnSZ8+ePT137tx5/ty5c0fPnj27/syZM1fOnDlz5vTp04ePHz9+yM8XS9Y9ePBg+5EjR7YdOXIkfceOHelbt27N2LRpU+b69eszVq9enbFs2bKMefPmZUyfPj1j/Pjx6cOGDUsdP358ypgxY+ZPGD8+c87sOdOnTpmaOWnSpMwJEyZkjh07NnPUqFGZI0eOzBwxYkTmsGHDMocOHRo2YsSIH+vXr38oU6ZMv/78889WX375ZcuvvvqqxddffNHi239+a/nlF1+2+PKzz1v8+cdvLf/+7deWf/36S8s///i95Reff9byk08+bvnBB++3/OCDd1u+9967Ld95+52yrdu0LZQ3b76PKleufKZ69eonq1atGla1atX91apV21G9evVNVatWXVepUqWVVapUmV+tWrVpNWvW7F62XPmJgUAg/K233mp5/Phxx/nz5+XixYty6dIluXz5sly5csW4evWqcf269nPdvNa4du2aXL161bh06ZJcvHhRLly4YNZfuXLFPH/+fKlTu05xE6hWrZq+8ZUrV+TYsWMyY8YM6d27t9SuXVuKFy8uxYoVk5IlS0qpUqWkdOnSUrZsWSlXrpxYgAXOQfMoV66clC5dWkqWLCnFihUT1xfLpETxElK6TGlp0LCBzJw5U9asWSNnzpwxgGfPnpWLFy/K0aNHZdTIUV6galWpV6+e7Ny5UyZOnCjFixWTggUKSoECBSR//vySL18+yZs3r+TJk0eCwaDky5dPgjrXMefymeN58+Y15woUKCD58+eXPHnySOHChY2FihUrJpMmTZLt27dL7dq1PaB69eqydetWmTp1qpQpU0aKFi0qRYoUkaJFi5ofooB8+fK5n+aXYDBoAioA58x184MLxoLOmTdwMF++vFKiRAmZNm2abNmyRWrVquUBNWrUkO3bt8ucOXOkXLlyUqJECeMDCioAP3RB7G8B7m94YXCBXLlySc6cOSVHjhxmcfbs2SVLliySOXNmyZQpk2TIkEHSp08vadOmlbRp00qq1KkkderUkjJVSkmdJrVpdNp0aSVDhgwGjGMIBCIgDMD8AwYMkJSp05gFGTNmlLRp00rq1KklVapUkjJlSvODadKkkZSC+aVJkyYfJfkhePkDYuPMmTPGxHPnzpUKFSqIBbElIFhnhBWxAG/s3o6HRcDEIWIBwHgJq4oVK8q8efNk06ZN0UgAhOPbGOZOSUAEBAHvmmACQJDQp6SkGJ989dUXCWAhdCCYRhYg5NwHXdLu4eUhX4aFJAu6GRXx4s0e6LlFixYRi6QkXP/Hjh0zPnBV8CQAKlasmASN7w8dOhS2YPbsTtLY+4SG9RdA+NHvCBnv7/eRLo48UDJlzkSWlNSpUkum5GBGw+qeU3eQHtG/9wAZP3682cP+TZs2zWQcFhAQBcJrlUmk13Mc/GCRokWlWLHiUqZMWalUqZJUrFhJSpcubZLRHvPOISitWrWSvHnzmmLVrFkzWbFihdy7d0+oA5s3bzZhK1OmjAQVDHMPHDhQOE5Bqlu3rqxbty5cV9jXuvZ+XVmxYoVZ+/jxY5OlFDPWA44CpftgnVqtZdFn70mTJsn+/ftN5rp3xpKVtm7daqrnxYsXZdeuXWbekSNHDB9dR4YhgK0jT548MWVblQoziRbWAgMDA6V58+Z/rV271oAhoC3YPvRcVUUl1W7bnqNu2x9XtzHxb5AkSf4HpBNTxugdEZAAAAAASUVORK5CYII=';
    
    // Criar e adicionar o favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = staticFaviconData;
    document.head.appendChild(link);
    
    console.log('Favicon estático aplicado com sucesso!');
}

// Exportar a função
export { applyStaticFavicon }; 