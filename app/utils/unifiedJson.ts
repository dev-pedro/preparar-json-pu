// Função para unificar os produtos do JSON com a "descricao" ou "denominacao" e mesma NCM
export default function unifiedJasonProduct(jsonProduct: any[]) {
  // Usar reduce para agrupar os produtos por "descricao" ou "denominacao"
  const unificados = jsonProduct.reduce((acc: any, produto: any) => {
    // Determinar a chave de agrupamento com "descricao" ou "denominacao" + NCM
    const chave = `${produto.descricao.trim() && produto.denominacao.trim()}_${
      produto.ncm
    }`;
    console.log(chave);

    // Verifica se já existe um produto com a mesma chave (descricao/denominacao + NCM)
    if (!acc[chave]) {
      // Se não existir, cria um novo agrupamento com os atributos do produto
      acc[chave] = {
        ...produto,
        codigosInterno: [...produto.codigosInterno], // Copia os codigosInterno
      };
    } else {
      // Se já existir, mescla os "codigosInterno" dos produtos duplicados
      acc[chave].codigosInterno = [
        ...Array.from(
          new Set([...acc[chave].codigosInterno, ...produto.codigosInterno])
        ),
      ];
    }

    return acc;
  }, {});

  // Transforma o objeto resultante de agrupamentos em um array
  return Object.values(unificados);
}
