const {
  insetedProffy,
  insetedClass,
  insertedAllClassScheduleValues,
} = require("./database/createProffy");
const db = require("./database/db");
const Database = require("./database/db");

const {
  subjects,
  weekdays,
  getSubject,
  convertHoursToMinutes,
} = require("./utils/format");
const { QueryTypes } = require("sequelize");

async function pageLanding(req, res) {
  const conexoes = (await insetedProffy.findAll()).length;
  return res.render("index.html", { conexoes });
}
async function pageStudy(req, res) {
  const filters = req.query;

  if (!filters.subject && !filters.weekday && !filters.time) {
    const query = `SELECT classes.*, proffys.*
      FROM proffys
      JOIN classes ON (classes.proffy_id = proffys.id)`;

    const proffys = await db.query(query, { type: QueryTypes.SELECT });

    proffys.map((proffy) => {
      proffy.subject = getSubject(proffy.subject);
    });

    return res.render("study.html", { proffys, subjects, filters, weekdays });
  }

  if (!filters.subject || !filters.weekday || !filters.time) {
    return res.render("study.html", { filters, subjects, weekdays });
  }

  //converter horas em minutos

  /*const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = "${filters.subject}"
    `*/

  //caso haja erro na hora da consulta do banco de dados

  const timeToMinutes = convertHoursToMinutes(filters.time);

  const query = `SELECT classes.*, proffys.*
    FROM proffys
    JOIN classes ON (classes.proffy_id = proffys.id)
    WHERE EXISTS (
        SELECT class_schedules.*
        FROM class_schedules
        WHERE class_schedules.class_id = classes.id
        AND class_schedules.weekday = ${filters.weekday}
        AND class_schedules.time_from <= ${timeToMinutes}
        AND class_schedules.time_to > ${timeToMinutes}
    )
    AND classes.subject = ${filters.subject}`;

  try {
    const proffys = await db.query(query, { type: QueryTypes.SELECT });

    proffys.map((proffy) => {
      proffy.subject = getSubject(proffy.subject);
    });
    console.log(proffys);

    return res.render("study.html", { proffys, subjects, filters, weekdays });
  } catch (error) {
    console.log(error);
  }
} //OK
function pageGiveClasses(req, res) {
  return res.render("give-classes.html", { subjects, weekdays });
}

async function saveClasses(req, res) {
  async function create() {
    const proffyValues = await insetedProffy.create({
      name: req.body.name,
      avatar: req.body.avatar,
      whatsapp: req.body.whatsapp,
      bio: req.body.bio,
    });
    const classesValues = await insetedClass.create({
      subject: req.body.subject,
      cost: req.body.cost,
      proffy_id: await proffyValues.id,
    });

    setTimeout(async () => {
      const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
          weekday,
          time_from: convertHoursToMinutes(req.body.time_from[index]),
          time_to: convertHoursToMinutes(req.body.time_to[index]),
          class_id: classesValues.id,
        };
      });
      classScheduleValues.forEach((classSchedule) => {
        const classScheduleValue = insertedAllClassScheduleValues.create({
          weekday: classSchedule.weekday,
          time_from: classSchedule.time_from,
          time_to: classSchedule.time_to,
          class_id: classSchedule.class_id,
        });
      });
      var queryString = "?subject=" + req.body.subject;
      queryString += "&weekday=" + req.body.weekday[0];
      queryString += "&time=" + req.body.time_from[0];

      //setTimeout( ()=>{
      //    return res.redirect("/sucess")
      //},2000)

      return res.redirect("/study" + queryString);
    }, 1000);
  }
  try {
    create();
  } catch (error) {
    console.log(error);
  }
} //OK

module.exports = {
  pageLanding,
  pageStudy,
  pageGiveClasses,
  saveClasses,
};
