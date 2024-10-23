const express=require("express")
const mysql=require("mysql")
const cors=require("cors")
const bodyParser = require("body-parser")
const bcrypt=require("bcrypt")




const app=express()
app.use(cors())

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const db=mysql.createConnection({
    host:"b7cwqkwop7hf8jhtz9ji-mysql.services.clever-cloud.com",
    user:"u8lh2hlnvue2lx3i",
    password:"RX9958kU6I25vu0N6kZi",
    database:"b7cwqkwop7hf8jhtz9ji",
})

db.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données :', err);
      return;
    }
    console.log('Connexion à la base de données réussie.');
})
  
app.post("/singin",(req,res)=>{
  const nom=req.body.nom
  const prenom=req.body.prenom
  const tel=req.body.tel
  const mail=req.body.mail
  const password=req.body.password

  const sql="SELECT*FROM utilisateur WHERE (nom=? AND prenom=?) OR tel=? OR mail=?"
  db.query(sql,[nom,prenom,tel,mail],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      if (data.length>0) {
        res.send('utilisateur existant')
      } else {
        
        bcrypt.hash(password,10,(err,mdp)=>{
          if (err) {
            console.log(err)
          } else {
            db.query("INSERT INTO utilisateur (nom,prenom,tel,mail,password,idetudiant) VALUES (?,?,?,?,?,null)",[nom,prenom,tel,mail,mdp],(err,data)=>{
              if (err) {
                res.send(err)
              } else {
                res.send("insertion réussi")
              }
            })
          }
        })
        
      }
    }
  })
})


app.post("/login",(req,res)=>{
  mailtel=req.body.mailtel
  password=req.body.password

  let sql="SELECT * FROM utilisateur WHERE mail=? OR tel=?"
  db.query(sql,[mailtel,mailtel],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      if (data.length>0) {
       bcrypt.compare(password,data[0].password,(err,result)=>{
          if (err) {
            res.send(err)
          } else { 
            if (result==true) {
              if (data[0].profil==="etudiant") {
                res.send("etudiant")
              }
              if (data[0].profil==="DE") {
                res.send("DE")
              }
              if (data[0].profil==="prof") {
                res.send("prof")
              }
            } else {
              res.send("identifiant ou mot de passe incorrect")
            }
          }
        })
        
      } else {
        res.send("identifiant ou mot de passe incorrect")
      }
    }
  })
})

app.post("/id",(req,res)=>{
  let mail=req.body.mail
  const sql="SELECT iduser FROM utilisateur WHERE mail=?"
  db.query(sql,[mail],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      res.send(data[0])
    }
  })
})


app.post("/idconnecte",(req,res)=>{
  let id=req.body.result
  const sql="SELECT*FROM utilisateur WHERE iduser=?"
  db.query(sql,[id],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      res.send(data[0])
    }
  })
})


app.get("/filliere",(req,res)=>{
  const sql="SELECT*FROM filliere"
  db.query(sql,[],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})



app.post("/insertionetudiant",(req,res)=>{
  const nom=req.body.nom
  const prenom=req.body.prenom
  const sexe=req.body.valuesexe
  const localisation=req.body.localisation
  const tel=req.body.tel
  const mail=req.body.mail
  const telparent=req.body.telparent
  const mailparent=req.body.mailparent
  const datenaissance=req.body.datenaissance
  const lieunaissance=req.body.lieunaissance
  const nationalite=req.body.nationalite
  const valuediplome=req.body.valuediplome
  const anneediplome=req.body.anneediplome
  const valuediplomemention=req.body.valuediplomemention
  const valuefilliere=req.body.valuefilliere
  const valueniveau=req.body.valueniveau
  const valueanneacademique=req.body.valueanneacademique
  const password=req.body.password


  db.query("SELECT * FROM etudiant WHERE (nom=? AND prenom=?) OR tel=? OR mail=? AND anneeacademique=?",[nom,prenom,tel,mail,valueanneacademique],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      if (data.length>0) {
        res.send("etudiant déja inscrit")
      } else {
        db.query("SELECT * FROM utilisateur WHERE (nom=? AND prenom=?) OR tel=? OR mail=?",[nom,prenom,tel,mail],(err,data)=>{
          if (err) {
            console.log(err)
          } else {
            bcrypt.compare(password,data[0].password,(err,result)=>{
              if (err) {
                console.log(err)
              } else {
                if (result===true) {
                  db.query("INSERT INTO etudiant (nom,prenom,sexe,localisation,tel,mail,telparent,mailparent,datenaissance,lieu_naissance,nationalite,diplome_entre_universitaire,annee_obtention,mention,filliere,niveau_academique,anneeacademique) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[nom,prenom,sexe,localisation,tel,mail,telparent,mailparent,datenaissance,lieunaissance,nationalite,valuediplome,anneediplome,valuediplomemention,valuefilliere,valueniveau,valueanneacademique],(err,data)=>{
                  if (err) {
                  console.log(err)
                  } else {
                      db.query("UPDATE utilisateur SET idetudiant=?,profil=? WHERE (nom=? AND prenom=?) OR tel=? OR mail=?",[data.insertId,"etudiant",nom,prenom,tel,mail],(err,data)=>{
                      if (err) {
                        console.log(err)
                      } else {
                        res.send("Vous etes desormains etudiant à HECM")
                      }
                    })
                  }
                  })
                } else {
                  res.send("mot de passe incorrect")
                }
              }
            })
          }
        })
      }
    }
  })
})

app.post("/profil",(req,res)=>{
  let id=req.body.result
  const sql="SELECT*FROM utilisateur WHERE iduser=?"
  db.query(sql,[id],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      db.query("SELECT*FROM etudiant WHERE id=?",[data[0].idetudiant],(err,data)=>{
        if (err) {
          res.send(err)
        } else {
          res.send(data)
        }
      })
    }
  })
})

app.post("/DEprofil",(req,res)=>{
  let id=req.body.result
  const sql="SELECT*FROM utilisateur WHERE iduser=?"
  db.query(sql,[id],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})


app.post("/modifmail",(req,res)=>{
  const id=req.body.id
  const mail=req.body.mail
  const password=req.body.password


  const sql="SELECT*FROM utilisateur WHERE idetudiant=?"
  db.query(sql,[id],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      bcrypt.compare(password,data[0].password,(err,result)=>{
        if (err) {
          console.log(err)
        } else {
          if (result===true) {
            db.query("UPDATE etudiant SET mail=? WHERE id=?",[mail,id],(err,data)=>{
              if (err) {
                res.send(err)
              } else {
                db.query("UPDATE utilisateur SET mail=? WHERE idetudiant=?",[mail,id],(err,data)=>{
                  if (err) {
                    res.send(err)
                  } else {
                    res.send("email modifier avec susces")
                  }
                })
              }
            })
          } else {
            res.send("mot de passe incorrect")
          }
        }
      })
    }
  })


})


app.post("/idconnexion",(req,res)=>{
  let mail=req.body.mailtel
  const sql="SELECT*FROM utilisateur WHERE mail=? OR tel=?"
  db.query(sql,[mail,mail],(err,data1)=>{
    if (err) {
      console.log(err)
    } else {
        if (data1[0].profil==="etudiant") {
          db.query("SELECT*FROM etudiant WHERE id=?",[data1[0].idetudiant],(err,data)=>{
            if (err) {
              console.log(err)
            } else {
              if (data.length>0) {
                res.send(data1[0])
              } else {
                res.send(["pas encore etudiant",data1[0].iduser])
              }
            }
          })
        }
        if (data1[0].profil==="DE") {
          res.send(data1[0])
        }
        if (data1[0].profil==="prof") {
          res.send(data1[0])
        }
     
    }
  })
 
})


app.post("/modifpassword",(req,res)=>{
  let password1=req.body.password1
  let password2=req.body.password2
  let password3=req.body.password3
  let id=req.body.id
  const sql="SELECT*FROM utilisateur WHERE idetudiant=?"
  db.query(sql,[id],(err,data1)=>{
    if (err) {
      console.log(err)
    } else {
        bcrypt.compare(password3,data1[0].password,(err,result)=>{
          if (err) {
            console.log(err)
          } else {
            if (result===true) {
              bcrypt.hash(password1,10,(err,mdp)=>{
                if (err) {
                  console.log(err)
                } else {
                  db.query("UPDATE utilisateur SET password=?",[mdp],(err,data)=>{
                    if (err) {
                      console.log(err)
                    } else {
                      res.send("mot de passe modifier avec susces")
                    }
                  })
                }
              })
            } else {
              res.send("mot de passe incorrect")
            }
          }
        })
     
    }
  })
 
})



app.post("/modifnumero",(req,res)=>{
  const id=req.body.id
  const numero=req.body.numero
  const passwordnumero=req.body.passwordnumero


  const sql="SELECT*FROM utilisateur WHERE idetudiant=?"
  db.query(sql,[id],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      bcrypt.compare(passwordnumero,data[0].password,(err,result)=>{
        if (err) {
          console.log(err)
        } else {
          if (result===true) {
            db.query("UPDATE etudiant SET tel=? WHERE id=?",[numero,id],(err,data)=>{
              if (err) {
                res.send(err)
              } else {
                db.query("UPDATE utilisateur SET tel=? WHERE idetudiant=?",[numero,id],(err,data)=>{
                  if (err) {
                    res.send(err)
                  } else {
                    res.send("numero modifier avec susces")
                  }
                })
              }
            })
          } else {
            res.send("mot de passe incorrect")
          }
        }
      })
    }
  })


})


app.post("/infoscolarite",(req,res)=>{
  let codefil=req.body.codefil
  let codeniveau=req.body.codeniveau
  const sql="SELECT*FROM montantscolarite WHERE codefilliere=? AND codeniveau=?"
  db.query(sql,[codefil,codeniveau],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
     res.send(data)
    }
  })
})

app.post("/verifyscolarite",(req,res)=>{
  let id=req.body.id
  let anneeacademique=req.body.anneeacademique
  const sql="SELECT*FROM scolarite WHERE idetudiant=? AND anneeacademique=?"
  db.query(sql,[id,anneeacademique],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
     res.send(data)
    }
  })
})


app.post("/insertpayement",(req,res)=>{
  const datepayement=req.body.datepayement
  const soldedu=req.body.soldedu
  const idetudiant=req.body.idetudiant
  const anneeacademique=req.body.anneeacademique
  const montant=req.body.montant
  const tel=req.body.tel
  const payementmethode=req.body.payementmethode
  const sql="INSERT INTO scolarite (moyenpayement,montant,numéropayement,datepayement,soldedu,idetudiant,anneeacademique)VALUES(?,?,?,?,?,?,?)"
  db.query(sql,[payementmethode,montant,tel,datepayement,soldedu,idetudiant,anneeacademique],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
     res.send("payement effectué")
    }
  })
})



app.post("/surchfilliereetudiantall",(req,res)=>{
  const filliere=req.body.filliere
  const anneeacademique=req.body.anneeacademique

  db.query("SELECT * FROM etudiant WHERE filliere=? AND anneeacademique=? ORDER BY niveau_academique",[filliere,anneeacademique],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      res.send(data)
    }
  })
})

app.post("/surchfilliereetudiant",(req,res)=>{
  const filliere=req.body.filliere
  const anneeacademique=req.body.anneeacademique
  const niveau=req.body.niveau

  db.query("SELECT * FROM etudiant WHERE filliere=? AND anneeacademique=? AND niveau_academique=? ORDER BY nom",[filliere,anneeacademique,niveau],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      res.send(data)
    }
  })
})


app.post("/recherche",(req,res)=>{
  const entre=req.body.text
  if (entre!="") {
    db.query('SELECT * FROM etudiant WHERE nom LIKE  ?  OR prenom LIKE ? ',["%"+entre+"%","%"+entre+"%"],(err,data)=>{
      if (err) {
        console.log(err)
      } else {
        res.send(data)
      }
    })
  } else {
    res.send([])
  }
})


app.post("/suppressionetudiant",(req,res)=>{
  const id=req.body.id
    db.query('DELETE FROM etudiant WHERE id=?',[id],(err,data)=>{
      if (err) {
        console.log(err)
      } else {
        db.query('DELETE FROM utilisateur WHERE idetudiant=?',[id],(err,data)=>{
          if (err) {
            console.log(err)
          } else {
            res.send("etudiant supprimé avec susces")
          }
        })
      }
    })
})


app.post("/modetudiant",(req,res)=>{
  const id=req.body.id
    db.query('SELECT * FROM etudiant WHERE id=?',[id],(err,data)=>{
      if (err) {
        console.log(err)
      } else {
        res.send(data)
      }
    })
})



app.post("/modificationetudiant",(req,res)=>{
  const id=req.body.id
  const nom=req.body.nom
  const prenom=req.body.prenom
  const sexe=req.body.sexe
  const localisation=req.body.localisation
  const tel=req.body.tel
  const mail=req.body.mail
  const telparent=req.body.telparent
  const mailparent=req.body.mailparent
  const datenaissance=req.body.datenaissance
  const lieunaissance=req.body.lieunaissance
  const nationalite=req.body.nationalite
  const diplome=req.body.diplome
  const annee_diplome=req.body.annee_diplome
  const mention=req.body.mention
  const filliere=req.body.filliere
  const niveau=req.body.niveau
  const anneeacademique=req.body.anneeacademique
  const password=req.body.password

  
  db.query("SELECT * FROM etudiant WHERE (nom=? AND prenom=?) OR tel=? OR mail=? AND anneeacademique=?",[nom,prenom,tel,mail,anneeacademique],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      if (data.length>1) {
        res.send("etudiant déja inscrit")
      } else {
        db.query("SELECT * FROM utilisateur WHERE profil=?",["DE"],(err,data)=>{
          if (err) {
            console.log(err)
          } else {
            bcrypt.compare(password,data[0].password,(err,result)=>{
              if (err) {
                console.log(err)
              } else {
                if (result===true) {
                  db.query("UPDATE etudiant  SET nom=?,prenom=?,sexe=?,localisation=?,tel=?,mail=?,telparent=?,mailparent=?,datenaissance=?,lieu_naissance=?,nationalite=?,diplome_entre_universitaire=?,annee_obtention=?,mention=?,filliere=?,niveau_academique=?,anneeacademique=? WHERE id=?",[nom,prenom,sexe,localisation,tel,mail,telparent,mailparent,datenaissance,lieunaissance,nationalite,diplome,annee_diplome,mention,filliere,niveau,anneeacademique,id],(err,data)=>{
                  if (err) {
                  console.log(err)
                  } else {
                      db.query("UPDATE utilisateur SET nom=?,prenom=?,tel=?,mail=? WHERE idetudiant=?",[nom,prenom,tel,mail,nom,prenom,tel,mail,id],(err,data)=>{
                      if (err) {
                        console.log(err)
                      } else {
                        res.send("Modification effectuée avec susces")
                      }
                    })
                  }
                  })
                } else {
                  res.send("mot de passe incorrect")
                }
              }
            })
          }
        })
      }
    }
  })
})


app.get("/cours",(req,res)=>{
  const sql="SELECT*FROM cours"
  db.query(sql,[],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})


app.get("/professeur",(req,res)=>{
  const sql="SELECT*FROM utilisateur WHERE profil='professeur'"
  db.query(sql,[],(err,data)=>{
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})


app.post("/modf",(req,res)=>{
  const code=req.body.code
  const codefilière=req.body.codefilière
  const filière=req.body.filière
  const password=req.body.password
  
  db.query("SELECT * FROM utilisateur WHERE profil=?",["DE"],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      bcrypt.compare(password,data[0].password,(err,result)=>{
        if (err) {
          console.log(err)
        } else {
          if (result===true) {
            db.query("SELECT * FROM filliere WHERE codefilliere=? OR designfilliere=?",[codefilière,filière],(err,data)=>{
              if (err) {
                console.log(err)
              } else {
                if (data.length>1) {
                  res.send("filière existante")
                } else {
                  db.query("SET foreign_key_checks=0",[],(err,data)=>{
                    if (err) {
                      console.log(err)
                    } else {
                      db.query("UPDATE filliere SET codefilliere=?,designfilliere=? WHERE codefilliere=?",[codefilière,filière,code],(err,data)=>{
                        if (err) {
                         console.log(err)
                        } else {
                          db.query("SET foreign_key_checks=1",[],(err,data)=>{
                            if (err) {
                              console.log(err)
                            } else {
                              db.query("UPDATE etudiant  SET filliere=? WHERE filliere=?",[codefilière,code],(err,data)=>{
                                if (err) {
                                 console.log(err)
                                } else {
                                  db.query("UPDATE montantscolarite SET codefilliere=? WHERE codefilliere=?",[codefilière,code],(err,data)=>{
                                    if (err) {
                                     console.log(err)
                                    } else {
                                     res.send("filière modifiée avec susces")
                                    }
                                   })
                                }
                               })
                            }
                          })
                        }
                       })
                    }
                  })
                }
              }
            })
          } else {
            res.send("mot de passe incorrecte")
          }
        }
      })
    }
  })
})



app.post("/ajf",(req,res)=>{
  const codefilière=req.body.codefilière
  const filière=req.body.filière
  const password=req.body.password
  
  db.query("SELECT * FROM utilisateur WHERE profil=?",["DE"],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      bcrypt.compare(password,data[0].password,(err,result)=>{
        if (err) {
          console.log(err)
        } else {
          if (result===true) {
            db.query("SELECT * FROM filliere WHERE codefilliere=? OR designfilliere=?",[codefilière,filière],(err,data)=>{
              if (err) {
                console.log(err)
              } else {
                if (data.length>0) {
                  res.send("filière existante")
                } else {
                 db.query("INSERT INTO filliere VALUES(?,?)",[codefilière,filière],(err,data)=>{
                  if (err) {
                    console.log(err)
                  } else {
                    res.send("filière ajouter avec susces")
                  }
                 })
                }
              }
            })
          } else {
            res.send("mot de passe incorrecte")
          }
        }
      })
    }
  })
})


app.post("/modm",(req,res)=>{

  const code=req.body.code
  const codecours=req.body.codecours
  const nomcours=req.body.nomcours
  const password=req.body.password

  
  
  db.query("SELECT * FROM utilisateur WHERE profil=?",["DE"],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      bcrypt.compare(password,data[0].password,(err,result)=>{
        if (err) {
          console.log(err)
        } else {
          if (result===true) {
            db.query("SELECT * FROM cours WHERE codecours=? OR designcours=?",[codecours,nomcours],(err,data)=>{
              if (err) {
                console.log(err)
              } else {
                if (data.length>1) {
                  res.send("Matière existante")
                } else {
                  db.query("SET foreign_key_checks=0",[],(err,data)=>{
                    if (err) {
                      console.log(err)
                    } else {
                      db.query("UPDATE cours SET codecours=?,designcours=? WHERE codecours=?",[codecours,nomcours,code],(err,data)=>{
                        if (err) {
                         console.log(err)
                        } else {
                          db.query("SET foreign_key_checks=1",[],(err,data)=>{
                            if (err) {
                              console.log(err)
                            } else {
                              db.query("UPDATE programme  SET codecours=? WHERE codecours=?",[codecours,code],(err,data)=>{
                                if (err) {
                                 console.log(err)
                                } else {
                                     res.send("matière modifiée avec susces")
                                }
                               })
                            }
                          })
                        }
                       })
                    }
                  })
                }
              }
            })
          } else {
            res.send("mot de passe incorrecte")
          }
        }
      })
    }
  })
})


app.post("/ajm",(req,res)=>{
  const codematière=req.body.codematière
  const matière=req.body.matière
  const password=req.body.password
  
  db.query("SELECT * FROM utilisateur WHERE profil=?",["DE"],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      bcrypt.compare(password,data[0].password,(err,result)=>{
        if (err) {
          console.log(err)
        } else {
          if (result===true) {
            db.query("SELECT * FROM cours WHERE codecours=? OR designcours=?",[codematière,matière],(err,data)=>{
              if (err) {
                console.log(err)
              } else {
                if (data.length>0) {
                  res.send("matière existante")
                } else {
                 db.query("INSERT INTO cours VALUES(?,?)",[codematière,matière],(err,data)=>{
                  if (err) {
                    console.log(err)
                  } else {
                    res.send("matière ajouter avec susces")
                  }
                 })
                }
              }
            })
          } else {
            res.send("mot de passe incorrecte")
          }
        }
      })
    }
  })
})

app.post("/ajp",(req,res)=>{
  const nomprofesseur=req.body.nomprofesseur
  const prenomprofesseur=req.body.prenomprofesseur
  const mail=req.body.mail
  const tel=req.body.tel
  const mdp=req.body.mdp
  const password=req.body.password
  
  db.query("SELECT * FROM utilisateur WHERE profil=?",["DE"],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      bcrypt.compare(password,data[0].password,(err,result)=>{
        if (err) {
          console.log(err)
        } else {
          if (result===true) {
            db.query("SELECT * FROM utilisateur WHERE (nom=? AND prenom=?) OR mail=? OR tel=?",[nomprofesseur,prenomprofesseur,mail,tel],(err,data)=>{
             if (err) {
              console.log(err)
             } else {
              if (data.length>0) {
                res.send("professeur existant")
              } else {
                    bcrypt.hash(mdp,10,(err,pass)=>{
                      if (err) {
                        console.log(err)
                      } else {
                        db.query("INSERT INTO utilisateur (nom,prenom,tel,mail,password,profil,idetudiant) VALUES (?,?,?,?,?,?,null)",[nomprofesseur,prenomprofesseur,tel,mail,pass,"professeur"],(err,data)=>{
                          if (err) {
                            console.log(err)
                          } else {
                            res.send("professeur ajouté avec susces")
                          }
                        })
                      }
                    })
              }
             }
            })
          } else {
            res.send("mot de passe incorrecte")
          }
        }
      })
    }
  })
})


app.post("/modp",(req,res)=>{
  const nomprofesseur=req.body.nom
  const prenomprofesseur=req.body.prenom
  const mail=req.body.mail
  const tel=req.body.tel
  const id=req.body.id
  const password=req.body.password
  
  db.query("SELECT * FROM utilisateur WHERE profil=?",["DE"],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      bcrypt.compare(password,data[0].password,(err,result)=>{
        if (err) {
          console.log(err)
        } else {
          if (result===true) {
            db.query("SELECT * FROM utilisateur WHERE (nom=? AND prenom=?) OR mail=? OR tel=?",[nomprofesseur,prenomprofesseur,mail,tel],(err,data)=>{
             if (err) {
              console.log(err)
             } else {
              if (data.length>1) {
                res.send("professeur existant")
              } else {
               
                        db.query("UPDATE utilisateur SET nom=?,prenom=?,tel=?,mail=? WHERE iduser=?",[nomprofesseur,prenomprofesseur,tel,mail,id],(err,data)=>{
                          if (err) {
                            console.log(err)
                          } else {
                            res.send("professeur modifié avec susces")
                          }
                        })
                     
                 
              }
             }
            })
          } else {
            res.send("mot de passe incorrecte")
          }
        }
      })
    }
  })
})

app.post("/programme",(req,res)=>{
  const filliere=req.body.filliere
  const debut=req.body.debut


  db.query("SELECT*FROM programme WHERE datedebut=? AND filière=?",[debut,filliere],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      if (data.length>0) {
        res.send("pris")
      } else {
        res.send("libre")
      }
    }
  })

})



app.post("/emploidutemps",(req,res)=>{
  const jour=req.body.jour
  const filliere=req.body.filliere
  const anneeacademique=req.body.anneeacademique
  const niveau=req.body.niveau
  const debut=req.body.debut
  const fin=req.body.fin
  const valueheuredebutmatinnée=req.body.valueheuredebutmatinnée
  const valueheurefinmatinnée=req.body.valueheurefinmatinnée
  const valuecoursm=req.body.valuecoursm
  const valueprofesseurm=req.body.valueprofesseurm   
  const coursm=req.body.coursm
  const valueheuredebutsoirée=req.body.valueheuredebutsoirée
  const valueheurefinsoirée=req.body.valueheurefinsoirée
  const valuecourss=req.body.valuecourss
  const valueprofesseurs=req.body.valueprofesseurs
  const courss=req.body.courss
  //console.log(jour,filliere,niveau,anneeacademique,debut,fin,valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm,coursm,valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs,courss)
  db.query("SELECT * FROM programme WHERE datedebut=? AND filière=?",[debut,filliere],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
      if (data.length>0 && data[0].lundi!==null && data[0].mardi!==null&&data[0].mercredi!==null&&data[0].jeudi!==null&&data[0].vendredi!==null&&data[0].samedi!==null) {
        res.send("programme existant")
      } else {
        if (jour==="lundi") {
          let programmejour=[]
          if (coursm===true) {
            if (courss===true) {
              programmejour=[["libre"],["libre"]]
            } else {
              programmejour=[["libre"],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          } else {
            if (courss===true) {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],["libre"]]
            } else {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          }
          
          programmejour=JSON.stringify(programmejour)
         
          db.query("INSERT INTO programme (idprogramme,filière,datedebut,datefin,lundi,mardi,mercredi,jeudi,vendredi,samedi,anneeacademique,niveauacademique) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[null,filliere,debut,fin,programmejour,null,null,null,null,null,anneeacademique,niveau],(err,data)=>{
            if (err) {
              console.log(err)
            } else {
              res.send("programme du lundi enregistré")
            }
          })
        }


        if (jour==="mardi") {
          let programmejour=[]
          if (coursm===true) {
            if (courss===true) {
              programmejour=[["libre"],["libre"]]
            } else {
              programmejour=[["libre"],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          } else {
            if (courss===true) {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],["libre"]]
            } else {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          }
          
          programmejour=JSON.stringify(programmejour)
         
          db.query("UPDATE programme SET mardi=? WHERE datedebut=? AND filière=?",[programmejour,debut,filliere],(err,data)=>{
            if (err) {
              console.log(err)
            } else {
              res.send("programme du mardi enregistré")
            }
          })
        }


        if (jour==="mercredi") {
          let programmejour=[]
          if (coursm===true) {
            if (courss===true) {
              programmejour=[["libre"],["libre"]]
            } else {
              programmejour=[["libre"],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          } else {
            if (courss===true) {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],["libre"]]
            } else {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          }
          
          programmejour=JSON.stringify(programmejour)
         
          db.query("UPDATE programme SET mercredi=? WHERE datedebut=? AND filière=?",[programmejour,debut,filliere],(err,data)=>{
            if (err) {
              console.log(err)
            } else {
              res.send("programme du mercredi enregistré")
            }
          })
        }



        if (jour==="jeudi") {
          let programmejour=[]
          if (coursm===true) {
            if (courss===true) {
              programmejour=[["libre"],["libre"]]
            } else {
              programmejour=[["libre"],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          } else {
            if (courss===true) {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],["libre"]]
            } else {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          }
          
          programmejour=JSON.stringify(programmejour)
         
          db.query("UPDATE programme SET jeudi=? WHERE datedebut=? AND filière=?",[programmejour,debut,filliere],(err,data)=>{
            if (err) {
              console.log(err)
            } else {
              res.send("programme du jeudi enregistré")
            }
          })
        }

        if (jour==="vendredi") {
          let programmejour=[]
          if (coursm===true) {
            if (courss===true) {
              programmejour=[["libre"],["libre"]]
            } else {
              programmejour=[["libre"],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          } else {
            if (courss===true) {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],["libre"]]
            } else {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          }
          
          programmejour=JSON.stringify(programmejour)
         
          db.query("UPDATE programme SET vendredi=? WHERE datedebut=? AND filière=?",[programmejour,debut,filliere],(err,data)=>{
            if (err) {
              console.log(err)
            } else {
              res.send("programme du vendredi enregistré")
            }
          })
        }


        if (jour==="samedi") {
          let programmejour=[]
          if (coursm===true) {
            if (courss===true) {
              programmejour=[["libre"],["libre"]]
            } else {
              programmejour=[["libre"],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          } else {
            if (courss===true) {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],["libre"]]
            } else {
              programmejour=[[valueheuredebutmatinnée,valueheurefinmatinnée,valuecoursm,valueprofesseurm],[valueheuredebutsoirée,valueheurefinsoirée,valuecourss,valueprofesseurs]]
            }
          }
          
          programmejour=JSON.stringify(programmejour)
         
          db.query("UPDATE programme SET samedi=? WHERE datedebut=? AND filière=?",[programmejour,debut,filliere],(err,data)=>{
            if (err) {
              console.log(err)
            } else {
              res.send("programme du samedi enregistré")
            }
          })
        }

      }
    }
  })
})



app.post("/programmeetudiant",(req,res)=>{
  const filière=req.body.filière
  const today=req.body.today


  db.query("SELECT*FROM programme WHERE datedebut<=?  AND datefin>=? AND  filière=?",[today,today,filière],(err,data)=>{
    if (err) {
      console.log(err)
    } else {
     res.send(data)
    }
  })

})

app.listen(3001,()=>{
    console.log("serveur en ecoute sur 3001")
})

