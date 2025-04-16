document.getElementById("agregar-registro").addEventListener("click", () => {
  let fila = `<tr>
        <td><input type="date"></td>
        <td><input type="text" placeholder="Descripción"></td>
        <td><input type="number" class="ingreso" value="0"></td>
        <td><input type="number" class="egreso" value="0"></td>
        <td class="saldo">$0</td>
    </tr>`;
  document.getElementById("contabilidad-body").insertAdjacentHTML("beforeend", fila);
});
