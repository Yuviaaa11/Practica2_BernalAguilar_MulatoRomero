
/**
 * Aquí se define la estructura de los datos,
 * en su caso mapeo de datos a una base de datos.
 * 
 * Para el caso del formulario.
 *  1. Registrar usuario
 *  2. Recuperar usuario
 *  3. Modificar contraseña
 */

import sql from 'mssql';
import { poolPromise } from '../../APIREST/src/config/sqlserver.js';

export const readUsers = async () => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Users');
    return result.recordset;
};

export const writeUser = async (newUser) => {
    const { nombre, Telefono, correo, password, preguntaId, respuestarc } = newUser;
    const pool = await getConnection();
    await pool.request()
        .input('nombre',      sql.NVarChar, nombre)
        .input('Telefono',    sql.NVarChar, Telefono)
        .input('correo',      sql.NVarChar, correo)
        .input('password',    sql.NVarChar, password)
        .input('preguntaId',  sql.Int,      preguntaId)
        .input('respuestarc', sql.NVarChar, respuestarc)
        .query(`INSERT INTO Users (nombre, Telefono, correo, password, preguntaId, respuestarc)
                VALUES (@nombre, @Telefono, @correo, @password, @preguntaId, @respuestarc)`);
};

export const findUserByEmail = async (correo) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('correo', sql.NVarChar, correo)
        .query('SELECT * FROM Users WHERE correo = @correo');
    return result.recordset[0] || null;
};

export const existsUser = async (correo) =>
    !!(await findUserByEmail(correo));

export const updatePassword = async (correo, nuevaPassword) => {
    const pool = await getConnection();
    await pool.request()
        .input('correo',   sql.NVarChar, correo)
        .input('password', sql.NVarChar, nuevaPassword)
        .query('UPDATE Users SET password = @password WHERE correo = @correo');
};
