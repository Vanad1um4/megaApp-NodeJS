import { getConnection } from './db.js';

/// WEIGHTS ////////////////////////////////////////////////////////////////////

export async function getRangeOfUsersBodyWeightEntries(userId, startDateUnix, endDateUnix) {
  const connection = await getConnection();
  try {
    const query = `
      SELECT
        id, date, weight
      FROM
        foodBodyWeight
      WHERE
        usersId = ?
        AND date BETWEEN ? AND ?
      ORDER BY
        date ASC;
      `;
    const result = await connection.all(query, [userId, startDateUnix, endDateUnix]);
    return result;
  } catch (error) {
    console.error(error);
  }
}

/// DIARY //////////////////////////////////////////////////////////////////////

export async function dbCreateDiaryEntry(date, foodCatalogueId, foodWeight, history, userId) {
  const connection = await getConnection();
  try {
    const query = `
      INSERT INTO foodDiary (date, foodCatalogueId, foodWeight, history, usersId, ver, del)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const result = await connection.run(query, [date, foodCatalogueId, foodWeight, history, userId, 0, 0]);
    return result.lastID;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function dbGetDiaryEntriesHistory(diaryId, userId) {
  const connection = await getConnection();
  try {
    const query = `
      SELECT
        history
      FROM
        foodDiary
      WHERE
        id = ?
        AND usersId = ?;
    `;
    const result = await connection.all(query, [diaryId, userId]);
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRangeOfUsersDiaryEntries(userId, startDateUnix, endDateUnix) {
  const connection = await getConnection();
  try {
    const query = `
      SELECT
        id, date, foodCatalogueId, foodWeight, history
      FROM
        foodDiary
      WHERE
        usersId = ?
        AND date BETWEEN ? AND ?
      ORDER BY
        date ASC;
      `;
    const result = await connection.all(query, [userId, startDateUnix, endDateUnix]);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function dbEditDiaryEntry(foodWeight, history, diaryId, userId) {
  const connection = await getConnection();
  try {
    const query = `
      UPDATE
        foodDiary
      SET
        foodWeight = ?, history = ?
      WHERE
        id = ?
        AND usersId = ?;
    `;
    const values = [foodWeight, history, diaryId, userId];
    await connection.run(query, values);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getDiaryEntriesForDay(startOfDay, endOfDay) {
  const connection = await getConnection();
  try {
    const query = `
      SELECT id, date
      FROM foodDiary
      WHERE date BETWEEN ? AND ?
      ORDER BY date ASC;
    `;
    const result = await connection.all(query, [startOfDay, endOfDay]);
    return result;
  } catch (error) {
    console.error('Error in getDiaryEntriesForDay:', error);
    return [];
  }
}

/// CATALOGUE //////////////////////////////////////////////////////////////////

export async function addFoodCatalogueEntry(foodName, foodKcals) {
  const connection = await getConnection();
  try {
    const query = `
      INSERT INTO foodCatalogue (name, kcals)
      VALUES (?, ?);
    `;
    const result = await connection.run(query, [foodName, foodKcals]);
    return result.lastID;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateFoodCatalogueEntry(foodId, foodName, foodKcals) {
  const connection = await getConnection();
  try {
    const query = `
      UPDATE foodCatalogue
      SET name = ?, kcals = ?
      WHERE id = ?;
    `;
    await connection.run(query, [foodName, foodKcals, foodId]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteFoodCatalogueEntry(id) {
  const connection = await getConnection();
  try {
    const query = `
      DELETE FROM foodCatalogue
      WHERE id = ?;
    `;
    await connection.run(query, [id]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getAllFoodCatalogueEntries() {
  const connection = await getConnection();
  try {
    const query = `
      SELECT
        id, name, kcals
      FROM
        foodCatalogue
      ORDER BY
        name ASC;
    `;
    const result = await connection.all(query);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUsersFoodCatalogueIds(userId) {
  const connection = await getConnection();
  try {
    const query = `
      SELECT
        selectedCatalogueIds
      FROM
        foodSettings
      WHERE
        usersId = ?;
    `;
    const result = await connection.all(query, [userId]);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateUsersFoodCatalogueIdsList(selectedCatalogueIds, userId) {
  const connection = await getConnection();
  try {
    const query = `
      UPDATE
        foodSettings
      SET
        selectedCatalogueIds = ?
      WHERE
        usersId = ?;
    `;
    await connection.run(query, [selectedCatalogueIds, userId]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
