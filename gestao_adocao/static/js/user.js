function ativarEdicao() {
    document.getElementById('visualizacao').style.display = 'none';
    document.getElementById('form-edicao').style.display = 'block';
    document.getElementById('btn-editar-wrapper').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicao() {
    document.getElementById('visualizacao').style.display = 'block';
    document.getElementById('form-edicao').style.display = 'none';
    document.getElementById('btn-editar-wrapper').style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}