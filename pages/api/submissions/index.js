const db = require("../../../models/index.js");
const responseHandler = require("../utils/responseHandler");
const requestHandler = require("../utils/requestHandler");


export const config = {
  api: {
    bodyParser: false,
  },
}
const submissionsHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        let submissions, params;
        if (req.query.type === "peerreview") {
          if (!req.query.submissionId) {
            throw new Error("Query parameter submissionId required");
          }
          params = {};
          if (req.query.assignmentId) {
            params.assignmentId = req.query.assignmentId
          }
          params.canvasId = req.query.submissionId;
          submissions = await db.assignment_submissions.findOne({
            where: params,
          });
        } else {
          if (!req.query.submissionId && !req.query.groupId && !req.query.assignmentId) {
            throw new Error("Query parameter submissionId OR groupId OR assignmentId required");
          }
          params = {};
          if (req.query.assignmentId) {
            params.assignmentId = req.query.assignmentId;
          }
          if (req.query.groupId) {
            params.groupId = req.query.groupId;
          }
          if (req.query.submissionId) {
            params.canvasId = req.query.submissionId;
          }
          submissions = await db.assignment_submissions.findAll({
            where: params,
          });
        }
        responseHandler.response200(res, submissions);
        break;

      case "POST":
        await requestHandler.post(req,res, {table: "assignment_submissions"});
        break;

      case "PATCH":
        if (req.query.type === "multiple") {
          console.log(req.body);
          await Promise.all(
            req.body.map(submission =>
              db.assignment_submissions.update(submission, {
                where: { id: submission.id },
              }),
            ),
          );
            responseHandler.msgResponse201(
            res,
            "Successfully updated database entries.",
          );
        } else {
          throw new Error("PATCH /submissions must be of type='multiple'");
        }
        break;

      default:
        throw new Error("Invalid HTTP method");
    }
  } catch (err) {
    responseHandler.response400(res, err);
  }
};

export default submissionsHandler;
